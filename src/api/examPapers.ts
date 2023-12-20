import axios from './base'
import type { Option } from './questions'
import type { PaginationParameters } from '/#/utils'

export interface ExamPaper {
  examPaperId: number
  examPaperName: string
  difficultyLevel: number
  examPaperQuestions: ExamPaperQuestion[]
}

export interface ExamPaperQuestion {
  examPaperId: number
  questionId: number
  questionText: string
  questionType: number
  correctAnswer: string
  difficultyLevel: number
  options: Option[]
  order: number
}

export interface ExamPaperFilter {
  examPaperName?: string
  difficultyLevel?: number
}

export interface ExamPaperInput {
  examPaperName: string
  difficultyLevel: number
  ExamPaperQuestions: ExamPaperQuestionInput[]
}

export interface ExamPaperQuestionInput {
  questionId: number
  order: number
}

export interface ExamPaperUpdate {
  ExamPaperName?: string
  DifficultyLevel?: number
  ExamPaperQuestions?: ExamPaperQuestionInput[]
}

export async function count(params?: ExamPaperFilter) {
  const response = await axios.get<number>(`/examPapers/count`, { params })
  return response.data
}

export async function list(params?: PaginationParameters & ExamPaperFilter) {
  const response = await axios.get<ExamPaper[]>(`/examPapers/`, { params })
  return response.data
}

export async function get(examPaperId: number) {
  const response = await axios.get<ExamPaper>(`/examPapers/${examPaperId}`)
  return response.data
}

export async function create(examPaper: ExamPaperInput) {
  const response = await axios.post<ExamPaper>(`/examPapers/`, examPaper)
  return response.data
}

export async function update(examPaperId: number, examPaper: ExamPaperQuestionInput) {
  const response = await axios.put<ExamPaper>(`/examPapers/${examPaperId}`, examPaper)
  return response.data
}

export async function remove(examPaperId: number) {
  const response = await axios.delete<void>(`/examPapers/${examPaperId}`)
  return response.data
}
