export function formatSeconds(seconds: number) {
  // 计算小时、分钟和剩余的秒数
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  // 将小时、分钟和秒数格式化为两位数的字符串
  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

  // 构建最终的时间字符串
  const formattedTime = formattedHours + ':' + formattedMinutes + ':' + formattedSeconds

  return formattedTime
}
