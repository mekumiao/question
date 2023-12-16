import type { Option } from '@/api/questions'

export type OptionsType = 'SingleChoice' | 'MultipleChoice' | 'TrueFalse' | 'FillInTheBlank'

export type AnswerOption = {
  number: number
  questionId: number
  answer?: number | string | string[]
  options?: Option[]
}
