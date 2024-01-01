import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SheetList from '../answer/SheetList.vue'
import type { AnswerBoardQuestionWithIndex } from '../answer/data'

const options: AnswerBoardQuestionWithIndex[] = [
  {
    index: [0, 1],
    number: 1,
    questionId: 1,
    questionType: 1,
    answer: 'A',
    isAnswer: true,
    isCorrect: true,
    correctAnswer: 'A',
    answerText: 'A',
    difficultyLevel: 1,
    questionText: '测试题目文本',
    options: [
      {
        optionId: 1,
        questionId: 1,
        optionText: '选项A',
        optionCode: 'A',
      },
      {
        optionId: 2,
        questionId: 1,
        optionText: '选项B',
        optionCode: 'B',
      },
      {
        optionId: 3,
        questionId: 1,
        optionText: '选项C',
        optionCode: 'C',
      },
      {
        optionId: 4,
        questionId: 1,
        optionText: '选项D',
        optionCode: 'D',
      },
    ],
  },
]

describe('SheetList', () => {
  it('renders properly', () => {
    const wrapper = mount(SheetList, { props: { title: '一、选择题a', options } })
    expect(wrapper.text()).toContain('一、选择题a')
  })
})
