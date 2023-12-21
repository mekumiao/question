import axios from './base'
import type { PaginationParameters } from '/#/utils'

export interface AnswerHistoryFilter {
  studentId?: number
  examPaperId?: number
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
  studentAnswers: StudentAnswer[]
}

export interface StudentAnswer {
  studentAnswerId: number
  studentId: number
  questionId: number
  questionType: number
  answerHistoryId: number
  answerText: string
  isCorrect: boolean
}

export async function count(params?: AnswerHistoryFilter) {
  const response = await axios.get<number>(`/answerHistories/count`, { params })
  return response.data
}

export async function list(params?: PaginationParameters & AnswerHistoryFilter) {
  const response = await axios.get<AnswerHistory[]>(`/answerHistories/`, { params })
  return response.data
}

export async function get(answerHistoryId: number) {
  const response = await axios.get<AnswerHistory>(`/answerHistories/${answerHistoryId}`)
  return response.data
}
