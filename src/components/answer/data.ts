import type { AnswerBoardQuestion } from '@/api/answerBoard'

export type AnswerBoardQuestionWithIndex = AnswerBoardQuestion & {
  number: number
  index: [number, number]
  answer: string | string[]
  isAnswer: boolean
}
