import { downloadFile } from '@/utils'
import axios from './base'
import type { Paging, PagingResult } from '/#/paging'

export interface Question {
  questionId: number
  questionText: string
  questionType: number
  correctAnswer: string
  difficultyLevel: number
  options: Option[]
}

export interface Option {
  optionId: number
  questionId: number
  optionText: string
  optionCode: string
}

export interface QuestionCreate {
  questionText: string
  questionType: number
  correctAnswer: string
  difficultyLevel: number
  options: OptionCreate[]
}

export interface QuestionUpdate {
  questionText: string
  correctAnswer: string
  difficultyLevel: number
  options: OptionCreate[]
}

export interface OptionCreate {
  optionText: string
  optionCode: string
}

export interface QuestionFilter {
  questionTextOrId?: string
  questionType?: number
  difficultyLevel?: number
}

export async function count(params?: QuestionFilter) {
  // // 类型值为0则不传入条件
  // if (params && params.questionType && params.questionType < 0) {
  //   params = { ...params, questionType: undefined }
  // }
  const response = await axios.get<number>(`/questions/count`, { params })
  return response.data
}

export async function list(params?: Paging & QuestionFilter) {
  const response = await axios.get<PagingResult<Question>>(`/questions/`, { params })
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

export async function deleteQuestionItems(questionIds: number[]) {
  const response = await axios.delete<void>(`/questions/`, { data: questionIds })
  return response.data
}

export async function importFromExcel(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const resp = await axios.post<Question[]>(`/questions/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return resp.data
}

/**
 * 导出题目为excel
 * @param name 下载名称
 * @param questionIds 题目ID数组
 * @returns excel下载链接
 */
export async function exportToExcel(fileName: string, questionIds: number[]): Promise<void> {
  const resp = await axios.post<Blob>(`/questions/export`, questionIds, { responseType: 'blob' })
  downloadFile(resp.data, fileName)
}

/**
 * 下载导入模板
 */
export async function exportToExcelTemplate() {
  const resp = await axios.post<Blob>(`/questions/export/template`, null, { responseType: 'blob' })
  downloadFile(resp.data, '题目导入模板.xlsx')
}
