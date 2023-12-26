import axios from './base'
import { default as defaultAxios } from 'axios'
import type { TokenResult } from './base'
import { apiBaseUrl, setAccessToken, setRefreshToken, clearToken, getRefreshToken } from './base'
import type { Paging, PagingResult } from '/#/paging'

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
  userName?: string
  nickName?: string
  email?: string
}

export interface User {
  userId: number
  userName: string
  nickName: string
  email: string
  avatar: string | null
  createTime: string | null
  roles: string[]
  lockoutEnabled: boolean
}

export interface UserUpdate {
  nickName?: string
  roles?: string[]
  lockoutEnabled?: boolean
  password?: string
}

export interface UserInput {
  email: string
  nickName: string
  password: string
  roles: string[]
}

export async function count(params?: UserFilter) {
  const response = await axios.get<number>(`/users/count`, { params })
  return response.data
}

export async function list(params?: Paging & UserFilter) {
  const response = await axios.get<PagingResult<User>>(`/users/`, { params })
  return response.data
}

export async function get(userId: number) {
  const response = await axios.get<User>(`/users/${userId}`)
  return response.data
}

export async function update(userId: number, user: UserUpdate) {
  const response = await axios.put<User>(`/users/${userId}`, user)
  return response.data
}

export async function create(user: UserInput) {
  const response = await axios.post<User>(`/users/`, user)
  return response.data
}
