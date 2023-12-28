import axios from './base'
import type { Paging, PagingResult } from '/#/paging'

export interface AnswerHistoryFilter {
  studentId?: number
  examinationId?: number
  examPaperId?: number
  difficultyLevel?: number
  examPaperName?: string
  examinationType?: number
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
  totalNumberAnswers: number
  isTimeout: boolean
  totalQuestions: number
  timeTakenSeconds: number
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

export async function list(params?: Paging & AnswerHistoryFilter) {
  const response = await axios.get<PagingResult<AnswerHistory>>(`/answerHistories/`, { params })
  return response.data
}

export async function get(answerHistoryId: number) {
  const response = await axios.get<AnswerHistory>(`/answerHistories/${answerHistoryId}`)
  return response.data
}

export async function deleteAnswerHistoryItem(answerHistoryId: number) {
  const response = await axios.delete<void>(`/answerHistories/${answerHistoryId}/`)
  return response.data
}

export async function deleteAnswerHistoryItems(answerHistoryIds: number[]) {
  const response = await axios.delete<void>(`/answerHistories/`, {
    data: answerHistoryIds,
  })
  return response.data
}
