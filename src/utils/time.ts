export function getTimestamp() {
  const timestamp: number = Math.floor(new Date().getTime() / 1000)
  return timestamp
}
