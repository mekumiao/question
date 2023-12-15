import axios from './base'
import { default as defaultAxios } from 'axios'
import type { TokenResult } from './base'
import { apiBaseUrl, setAccessToken, setRefreshToken, clearToken, getRefreshToken } from './base'
import type { PaginationParameters } from '/#/utils'

export async function login(email: string, password: string) {
  const url = `${apiBaseUrl}/login`
  const response = await defaultAxios.post<TokenResult>(
    url,
    { email, password },
    { validateStatus: (status) => status === 200 },
  )
  setAccessToken(response.data.accessToken)
  setRefreshToken(response.data.refreshToken)
}

export async function logout() {
  clearToken()
  return Promise.resolve()
}

export async function checkUserAuthentication() {
  const islogin = !!getRefreshToken()
  return Promise.resolve(islogin)
}

export async function info() {
  return Promise.resolve({
    username: 'mekumiao',
    email: 'mekumiao@qq.com',
    role: ['admin', 'student'],
  })
}

export interface UserFilter {
  role?: string
  userName?: string
  email?: string
}

export interface User {
  userId: string
  userName: string
  email: string
  roles: string[]
}

export interface UserUpdate {
  userName: string
  roles: string[]
}

export async function count(params?: UserFilter) {
  const response = await axios.get<number>(`/users/count`, { params })
  return response.data
}

export async function list(params?: PaginationParameters & UserFilter) {
  const response = await axios.get<User[]>(`/users/`, { params })
  return response.data
}

export async function get(userId: number) {
  const response = await axios.get<User>(`/users/${userId}`)
  return response.data
}
