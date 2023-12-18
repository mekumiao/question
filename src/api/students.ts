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

export interface AnswerHistory {
  answerHistoryId: number
  studentId: number
  studentName: string
  examPaperId: number
  examPaperName: string
  startTime: Date
  submissionTime: Date
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

export async function answerHistory(studentId: number) {
  const response = await axios.get<AnswerHistory[]>(`/students/${studentId}/answer-history`)
  return response.data
}

export async function meAnswerHistory() {
  const response = await axios.get<AnswerHistory[]>(`/students/me/answer-history`)
  return response.data
}
