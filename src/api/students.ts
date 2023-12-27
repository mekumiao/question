import type { AnswerHistory } from './answerHistory'
import axios from './base'
import type { ExamPaper, ExamPaperFilter } from './examPapers'
import type { Paging, PagingResult } from '/#/paging'

export interface Student {
  studentId: number
  studentName: string
  userName: string | null
  email: string | null
  userId: number | null
  totalQuestions: number
  totalNumberAnswers: number
  answerRate: number
  totalIncorrectAnswers: number
  incorrectRate: number
  totalExamParticipations: number
  totalPracticeSessions: number
}

export interface StudentFilter {
  studentNameOrUserId?: string
}

export async function count(params?: StudentFilter) {
  const response = await axios.get<number>(`/students/count`, { params })
  return response.data
}

export async function list(params?: Paging & StudentFilter) {
  const response = await axios.get<PagingResult<Student>>(`/students/`, { params })
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

export async function getMyAnswerHistories(params: Paging) {
  const response = await axios.get<PagingResult<AnswerHistory>>(`/students/me/answer-history/`, {
    params,
  })
  return response.data
}

export async function getMyAnswerHistoryById(answerHistoryId: number) {
  const response = await axios.post<AnswerHistory>(
    `/students/me/answer-history/${answerHistoryId}/`,
  )
  return response.data
}

export async function deleteAnswerHistoryItem(answerHistoryId: number) {
  const response = await axios.delete<void>(`/students/me/answer-history/${answerHistoryId}/`)
  return response.data
}

export async function deleteAnswerHistoryItems(answerHistoryIds: number[]) {
  const response = await axios.delete<void>(`/students/me/answer-history/`, {
    data: answerHistoryIds,
  })
  return response.data
}

export async function resetSummary(studentId: number) {
  const response = await axios.put<Student>(`/students/${studentId}/reset-summary/`)
  return response.data
}

export async function getMeExamPaperList(params?: Paging & ExamPaperFilter) {
  const response = await axios.get<PagingResult<ExamPaper>>(`/students/me/exam-paper`, { params })
  return response.data
}

export async function getMeExamPaperCount() {
  const response = await axios.get<number>(`/students/me/exam-paper/count`)
  return response.data
}

export async function deleteItem(studentId: number) {
  const response = await axios.delete<void>(`/students/${studentId}/`)
  return response.data
}

export async function deleteItems(studentIds: number[]) {
  const response = await axios.delete<void>(`/students/`, { data: studentIds })
  return response.data
}
