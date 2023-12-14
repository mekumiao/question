import axios from './base'
import type { PaginationParameters } from '/#/utils'

export interface Question {
  questionId: number
  questionText: string
  questionType: number
  correctAnswer: string
  options: Option[]
}

export interface Option {
  optionId: number
  questionId: number
  optionText: string
  optionCode: string
  isCorrect: boolean
}

export interface QuestionCreate {
  questionText: string
  questionType: number
  correctAnswer: string
  options: OptionCreate[]
}

export interface QuestionUpdate {
  questionText: string
  correctAnswer: string
  options: OptionCreate[]
}

export interface OptionCreate {
  optionText: string
  isCorrect: boolean
}

export async function count() {
  const response = await axios.get<number>(`/questions/count`)
  return response.data
}

export async function list(params: PaginationParameters) {
  const { offset = 0, limit = 10 } = params
  const response = await axios.get<Question[]>(`/questions/?offset=${offset}&limit=${limit}`)
  return response.data
}

export async function get(questionId: number) {
  const response = await axios.get<Question>(`/questions/${questionId}`)
  return response.data
}

export async function create(question: QuestionCreate) {
  const response = await axios.post<Question>(`/questions/`, question)
  return response.data
}

export async function update(questionId: number, question: QuestionUpdate) {
  const response = await axios.put<Question>(`/questions/${questionId}`, question)
  return response.data
}

export async function remove(questionId: number) {
  const response = await axios.delete<void>(`/questions/${questionId}`)
  return response.data
}
