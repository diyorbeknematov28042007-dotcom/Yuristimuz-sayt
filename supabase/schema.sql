-- =============================================
-- LegalUZ MVP Database Schema
-- Supabase SQL Editor da ishga tushiring
-- =============================================

-- 1. PROFILES (har bir user uchun)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('client', 'lawyer')),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LAWYER PROFILES
CREATE TABLE IF NOT EXISTS public.lawyer_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialization TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  location TEXT,
  bio TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  tariff TEXT DEFAULT 'free' CHECK (tariff IN ('free', 'pro', 'pro_plus', 'enterprise')),
  credits INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADS (Elonlar)
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'lawyer')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  specialization TEXT NOT NULL,
  location TEXT,
  price_from INTEGER,
  price_to INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- 4. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lawyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  ad_id UUID REFERENCES public.ads(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, lawyer_id)
);

-- 5. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Lawyer profiles
CREATE POLICY "lawyer_profiles_select" ON public.lawyer_profiles FOR SELECT USING (TRUE);
CREATE POLICY "lawyer_profiles_insert" ON public.lawyer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "lawyer_profiles_update" ON public.lawyer_profiles FOR UPDATE USING (auth.uid() = id);

-- Ads
CREATE POLICY "ads_select" ON public.ads FOR SELECT USING (TRUE);
CREATE POLICY "ads_insert" ON public.ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ads_update" ON public.ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ads_delete" ON public.ads FOR DELETE USING (auth.uid() = user_id);

-- Conversations
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = lawyer_id);
CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = client_id OR auth.uid() = lawyer_id);
CREATE POLICY "conversations_update" ON public.conversations
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- Messages
CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.client_id = auth.uid() OR c.lawyer_id = auth.uid())
  )
);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.client_id = auth.uid() OR c.lawyer_id = auth.uid())
  )
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto profile yaratish
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Foydalanuvchi')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Last message update
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message = NEW.content, last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();
