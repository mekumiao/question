import axios from './base'
import type { User } from './users'

export async function info() {
  const resp = await axios.get<User>(`/account/info`)
  return resp.data
}
