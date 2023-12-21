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
  difficultyLevel: number
  examinationId: number | null
  examinationName: string | null
  examinationType: number | null
  startTime: string
  submissionTime: string
  isSubmission: boolean
  totalIncorrectAnswers: number
}

export interface StudentAnswer {
  answerText: string
  isCorrect: boolean
  studentAnswerId: number
  studentId: number
  questionId: number
  answerHistoryId: number
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

export async function getMyAnswerHistoriesCount() {
  const response = await axios.get<number>(`/students/me/answer-history/count`)
  return response.data
}

export async function getMyAnswerHistories(params: PaginationParameters) {
  const response = await axios.get<AnswerHistory[]>(`/students/me/answer-history/`, { params })
  return response.data
}

export async function getMyAnswerHistoryById(answerHistoryId: number) {
  const response = await axios.post<AnswerHistory>(
    `/students/me/answer-history/${answerHistoryId}/`,
  )
  return response.data
}
