export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      const base64Image = e.target?.result
      if (typeof base64Image === 'string') {
        resolve(base64Image)
      } else {
        reject('转换为base64失败')
      }
    }
    reader.readAsDataURL(file)
  })
}
