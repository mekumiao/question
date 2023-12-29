import axios from './base'

export interface AnswerBoard {
  answerBoardId: number
  examPaperName: number
  difficultyLevel: number
  totalIncorrectAnswers: number
  durationSeconds: number
  timeTakenSeconds: number
  isTimeout: number
  isSubmission: boolean
  totalQuestions: number
  totalNumberAnswers: number
  questions: AnswerBoardQuestion[]
  examinationId: number | null
}

export interface AnswerBoardQuestion {
  questionId: number
  questionText: string
  questionType: number
  difficultyLevel: number
  isCorrect: boolean | null
  answerText: string | null
  correctAnswer: string | null
  options: AnswerBoardQuestionOption[]
}

export interface AnswerBoardQuestionOption {
  optionId: number
  questionId: number
  optionCode: string
  optionText: string
}

export interface AnswerBoardInput {
  examPaperId?: number
  examinationId?: number
}

export interface AnswerInput {
  questionId: number
  answerText: string
}

export interface RandomGenerationInput {
  examPaperName?: string
  difficultyLevel?: number
}

/**
 * 获取答题板
 * @param answerBoardId 答题板ID
 * @returns
 */
export async function get(answerBoardId: number) {
  const response = await axios.get<AnswerBoard>(`/answerBoard/${answerBoardId}`)
  return response.data
}

/**
 * 创建答题板
 * @param params
 * @returns
 */
export async function create(answerBoard: AnswerBoardInput) {
  const response = await axios.post<AnswerBoard>(`/answerBoard/`, answerBoard)
  return response.data
}

/**
 * 提交试卷
 * @param studentId
 * @returns
 */
export async function update(answerBoardId: number, answers: AnswerInput[]) {
  const response = await axios.put<AnswerBoard>(`/answerBoard/${answerBoardId}`, answers)
  return response.data
}

export async function redoIncorrect(answerBoardId: number) {
  const response = await axios.post<AnswerBoard>(`/answerBoard/${answerBoardId}/redo-incorrect`)
  return response.data
}

export async function random(input: RandomGenerationInput) {
  const response = await axios.post<AnswerBoard>(`/answerBoard/random/`, input)
  return response.data
}
