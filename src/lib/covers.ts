export function bookCoverSrc(bookId: string, covers: Record<string, string>) {
  return covers[bookId] || `${import.meta.env.BASE_URL}books/${bookId}.jpg`
}

export function bookInitials(title: string) {
  const letters = title.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase())
  return letters.join('') || '?'
}

export function createCoverDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      const scale = Math.min(1, 720 / image.naturalWidth, 1020 / image.naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      const context = canvas.getContext('2d')
      if (!context) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('This image could not be prepared.'))
        return
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/webp', .86)
      URL.revokeObjectURL(objectUrl)
      resolve(dataUrl)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Choose a valid image file.'))
    }
    image.src = objectUrl
  })
}
