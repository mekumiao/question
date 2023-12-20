import axios from './base'
import type { PaginationParameters } from '/#/utils'

export interface ExaminationFilter {
  examinationName?: string
  examinationType?: number
}

export interface Examination {
  examinationId: number
  examinationName: string
  examinationType: number
  difficultyLevel: number
  examPaperId: number
  durationSeconds: number
}

export interface ExaminationInput {}

export interface ExaminationUpdate {}

export async function count(params?: ExaminationFilter) {
  const response = await axios.get<number>(`/examination/count`, { params })
  return response.data
}

export async function list(params?: PaginationParameters & ExaminationFilter) {
  const response = await axios.get<Examination[]>(`/examination/`, { params })
  return response.data
}

export async function get(examinationId: number) {
  const response = await axios.get<Examination>(`/examination/${examinationId}`)
  return response.data
}

export async function create(examination: ExaminationInput) {
  const response = await axios.post<Examination>(`/examination/`, examination)
  return response.data
}

export async function update(examinationId: number, examination: ExaminationUpdate) {
  const response = await axios.put<Examination>(`/examination/${examinationId}`, examination)
  return response.data
}

export async function remove(examinationId: number) {
  const response = await axios.delete<void>(`/examination/${examinationId}`)
  return response.data
}
