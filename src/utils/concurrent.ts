/**
 * 并发发起请求
 * @param poolLimit 限制并发数
 * @param array 参数数组
 * @param iteratorFn 执行方法
 * @returns 执行结果
 */
export async function asyncPool<T, TResult>(
  poolLimit: number,
  array: T[],
  iteratorFn: (item: T) => TResult,
) {
  const ret: Promise<TResult>[] = []
  const executing: Promise<TResult>[] = []
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)
    if (poolLimit <= array.length) {
      const e = p.then((value) => {
        executing.splice(executing.indexOf(e), 1)
        return value
      })
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}
