import axios from './base'

export interface Summary {
  incorrectRate: number
  answerRate: number
  totalUsers: number
  totalQuestions: number
  totalExamSessions: number
  totalExamParticipations: number
  examPaperCount: number
}

export async function summary() {
  const resp = await axios.get<Summary>(`/statistics/summary`)
  return resp.data
}
