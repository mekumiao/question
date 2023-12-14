import axios from './base'
import type { Option } from './questions'
import type { PaginationParameters } from '/#/utils'

export interface Exam {
  examId: number
  examName: string
  difficultyLevel: number
  examQuestions: ExamQuestion[]
}

export interface ExamQuestion {
  examId: number
  questionId: number
  questionText: string
  questionType: number
  correctAnswer: string
  difficultyLevel: number
  options: Option[]
  order: number
}

export interface ExamFilter {
  examName?: string
  difficultyLevel?: number
}

export async function count(params?: ExamFilter) {
  const response = await axios.get<number>(`/exams/count`, { params })
  return response.data
}

export async function list(params?: PaginationParameters & ExamFilter) {
  const response = await axios.get<Exam[]>(`/exams/`, { params })
  return response.data
}

export async function get(examId: number) {
  const response = await axios.get<Exam>(`/exams/${examId}`)
  return response.data
}

// export async function create(question: ExamCreate) {
//   const response = await axios.post<Exam>(`/exams/`, question)
//   return response.data
// }

// export async function update(examId: number, question: ExamUpdate) {
//   const response = await axios.put<Exam>(`/exams/${examId}`, question)
//   return response.data
// }

export async function remove(examId: number) {
  const response = await axios.delete<void>(`/exams/${examId}`)
  return response.data
}
