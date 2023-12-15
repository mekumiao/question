import axios from './base'
import type { PaginationParameters } from '/#/utils'

export interface Student {
  studentId: number
  name: string
  userName?: string
  email?: string
  userId?: string
}

export interface StudentFilter {
  name?: string
}

export async function count(params?: StudentFilter) {
  const response = await axios.get<number>(`/students/count`, { params })
  return response.data
}

export async function list(params?: PaginationParameters & StudentFilter) {
  const response = await axios.get<Student[]>(`/students/`, { params })
  return response.data
}

export async function get(studentId: number) {
  const response = await axios.get<Student>(`/students/${studentId}`)
  return response.data
}
