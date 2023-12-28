
/**
 * 下载文件
 * @param blob 文件
 * @param fileName 文件名
 */
export function downloadFile(blob: Blob, fileName?: string) {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  if (fileName) {
    link.download = fileName
  }

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(link.href)
}
