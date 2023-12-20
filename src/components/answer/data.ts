import type { Option } from '@/api/questions'

export type AnswerOption = {
  number: number
  questionId: number
  questionType: number
  answer?: number | number[] | string
  options?: Option[]
  isCorrect?: boolean
}
