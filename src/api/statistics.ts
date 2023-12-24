import axios from './base'

export interface Summary {
  mistakeRate: number
  answerRate: number
  userCount: number
  questionCount: number
  examinationCount: number
  examinationCountNumber: number
  examPaperCount: number
}

export async function summary() {
  const resp = await axios.get<Summary>(`/statistics/summary`)
  return resp.data
}
