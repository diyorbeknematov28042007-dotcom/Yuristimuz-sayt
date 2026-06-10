// Konstitutsiya quiz — yuristlar va mijozlar uchun bot tekshiruv

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number  // 0-based
  hint?: string
}

// Yuristlar uchun — Konstitutsiyaning 1-6 moddalari
export const LAWYER_QUESTIONS: QuizQuestion[] = [
  {
    question: "O'zbekiston — boshqaruvning respublika shakliga ega bo'lgan suveren, demokratik, huquqiy, ijtimoiy va dunyoviy davlat. Bu qaysi modda?",
    options: ["1-modda", "2-modda", "3-modda", "4-modda"],
    correctIndex: 0,
  },
  {
    question: "Davlat xalq irodasini ifoda etib, uning manfaatlariga xizmat qiladi. Davlat organlari va mansabdor shaxslar jamiyat va fuqarolar oldida ma'suldirlar. Bu qaysi modda?",
    options: ["1-modda", "2-modda", "3-modda", "5-modda"],
    correctIndex: 1,
  },
  {
    question: "O'zbekiston Respublikasi o'zining milliy-davlat va ma'muriy-hududiy tuzilishini, davlat hokimiyati organlarining tizimini belgilaydi. Bu qaysi modda?",
    options: ["2-modda", "3-modda", "4-modda", "6-modda"],
    correctIndex: 1,
  },
  {
    question: "O'zbekiston Respublikasining davlat tili o'zbek tilidir. Bu qaysi modda?",
    options: ["3-modda", "4-modda", "5-modda", "6-modda"],
    correctIndex: 1,
  },
  {
    question: "O'zbekiston Respublikasi qonun bilan tasdiqlanadigan o'z davlat ramzlari — bayrog'i, gerbi va madhiyasiga ega. Bu qaysi modda?",
    options: ["3-modda", "4-modda", "5-modda", "6-modda"],
    correctIndex: 2,
  },
  {
    question: "O'zbekiston Respublikasining poytaxti — Toshkent shahri. Bu qaysi modda?",
    options: ["4-modda", "5-modda", "6-modda", "7-modda"],
    correctIndex: 2,
  },
]

// Mijozlar uchun — O'zbekiston haqida umumiy savollar
export const CLIENT_QUESTIONS: QuizQuestion[] = [
  {
    question: "O'zbekiston bayrog'ida nechta rang bor?",
    options: ["3 ta", "4 ta", "5 ta", "2 ta"],
    correctIndex: 1,
  },
  {
    question: "O'zbekiston Respublikasi poytaxti qaysi shahar?",
    options: ["Samarqand", "Toshkent", "Buxoro", "Andijon"],
    correctIndex: 1,
  },
  {
    question: "O'zbekiston qachon mustaqil bo'lgan?",
    options: ["1989-yil", "1990-yil", "1991-yil", "1992-yil"],
    correctIndex: 2,
  },
]

// Random savol olish
export function getRandomQuestion(role: 'lawyer' | 'client'): QuizQuestion {
  const pool = role === 'lawyer' ? LAWYER_QUESTIONS : CLIENT_QUESTIONS
  return pool[Math.floor(Math.random() * pool.length)]
}
