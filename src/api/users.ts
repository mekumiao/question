import axios from './base'
import type { Paging, PagingResult } from '/#/paging'

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
  avatarFileId: number | null
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
