import axios, { setToken } from './base'
import type { User } from './users'
import type { TokenResult } from './base'
import { default as defaultAxios } from 'axios'
import { apiBaseUrl } from './base'

export interface InfoUpdate {
  nickName: string
  avatar?: string
  avatarFileId?: number
}

export interface ChangePassword {
  oldPassword: string
  newPassword: string
}

export async function register(email: string, password: string) {
  const url = `${apiBaseUrl}/register`
  await defaultAxios.post<void>(url, { email, password })
}

export async function login(email: string, password: string) {
  const url = `${apiBaseUrl}/login`
  const response = await defaultAxios.post<TokenResult>(
    url,
    { email, password },
    { validateStatus: (status) => status === 200 },
  )
  setToken({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  })
}

export async function logout() {
  setToken()
  return Promise.resolve()
}

export async function info() {
  const resp = await axios.get<User>(`/account/info`)
  return resp.data
}

export async function update(input: InfoUpdate) {
  const resp = await axios.put<User>(`/account/info`, input)
  return resp.data
}

export async function changePassword(input: ChangePassword) {
  const resp = await axios.put<void>(`/account/change-password`, input)
  return resp.data
}
