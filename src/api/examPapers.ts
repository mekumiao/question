import { downloadFile } from '@/utils'
import axios from './base'
import type { Option } from './questions'
import type { Paging, PagingResult } from '/#/paging'

export interface ExamPaper {
  examPaperId: number
  examPaperName: string
  difficultyLevel: number
  totalQuestions: number
  questions: ExamPaperQuestion[]
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
  examPaperType?: number
}

export interface ExamPaperInput {
  examPaperName: string
  difficultyLevel: number
  questions: ExamPaperQuestionInput[]
}

export interface ExamPaperQuestionInput {
  questionId: number
  correctAnswer: string
  order: number
}

export interface ExamPaperUpdate {
  examPaperName?: string
  difficultyLevel?: number
  questions?: ExamPaperQuestionInput[]
}

export interface ImportExamPaperFromExcelInput {
  examPaperName?: string
  file: File
}

export interface RandomGenerationInput {
  difficultyLevel?: number
  examPaperName?: string
}

export async function count(params?: ExamPaperFilter) {
  const response = await axios.get<number>(`/examPapers/count`, { params })
  return response.data
}

export async function list(params?: Paging & ExamPaperFilter) {
  const response = await axios.get<PagingResult<ExamPaper>>(`/examPapers/`, { params })
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

export async function update(examPaperId: number, examPaper: ExamPaperUpdate) {
  const response = await axios.put<ExamPaper>(`/examPapers/${examPaperId}`, examPaper)
  return response.data
}

export async function remove(examPaperId: number) {
  const response = await axios.delete<void>(`/examPapers/${examPaperId}`)
  return response.data
}

export async function deleteItems(examPaperIds: number[]) {
  const response = await axios.delete<void>(`/examPapers/`, { data: examPaperIds })
  return response.data
}

export async function importFromExcel(input: ImportExamPaperFromExcelInput) {
  const formData = new FormData()
  input.examPaperName && formData.append('examPaperName', input.examPaperName)
  formData.append('file', input.file)
  const resp = await axios.post<ExamPaper[]>(`/examPapers/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return resp.data
}

/**
 * 导出试卷为excel
 * @param name 下载名称
 * @param exampaperIds 试卷ID数组
 * @returns excel下载链接
 */
export async function exportToExcel(fileName: string, exampaperIds: number[]): Promise<void> {
  const resp = await axios.post<Blob>(`/examPapers/export`, exampaperIds, { responseType: 'blob' })
  downloadFile(resp.data, fileName)
}

/**
 * 下载导入模板
 */
export async function exportToExcelTemplate() {
  const resp = await axios.post<Blob>(`/examPapers/export/template`, null, { responseType: 'blob' })
  downloadFile(resp.data, '试卷导入模板.xlsx')
}

export async function random(input: RandomGenerationInput) {
  const response = await axios.post<ExamPaper>(`/examPapers/random`, input)
  return response.data
}
