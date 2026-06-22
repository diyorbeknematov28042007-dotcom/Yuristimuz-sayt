// ════════════════════════════════════════════════
// RASM SIQISH UTILITI
// /src/lib/compressImage.ts
// Hujjat rasmlarini Storage'ga yuklashdan oldin siqadi
// (sifat saqlanadi, hajm kamayadi — DB/Storage qiynalmaydi)
// ════════════════════════════════════════════════

/**
 * Rasmni siqadi: max o'lcham 1600px, JPEG sifat 0.82
 * Litsenziya/hujjat matni o'qilishi uchun yetarli sifat, lekin kichik hajm
 */
export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // PDF bo'lsa siqmaymiz (faqat rasm)
    if (file.type === 'application/pdf') {
      resolve(file)
      return
    }

    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Faylni o\'qib bo\'lmadi'))

    img.onload = () => {
      let { width, height } = img

      // Kattaroq o'lchamni maxDim ga moslab kichraytiramiz (nisbatni saqlab)
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas qo\'llab-quvvatlanmaydi'))
        return
      }

      // Oq fon (shaffof PNG uchun) + chizish
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Siqishda xatolik'))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => reject(new Error('Rasmni yuklab bo\'lmadi'))

    reader.readAsDataURL(file)
  })
}
