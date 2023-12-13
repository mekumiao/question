import type { Question } from '@/api/questions'
import { NTag, type DataTableColumns, NButton } from 'naive-ui'
import { h } from 'vue'

export function createColumns({
  sendMail,
}: {
  sendMail: (rowData: Question) => void
}): DataTableColumns<Question> {
  return [
    {
      title: '题目',
      key: 'questionText',
    },
    {
      title: '类型',
      key: 'questionType',
      render(row) {
        return h(
          NTag,
          {
            // @ts-ignore
            type: ['primary', 'success', 'info', 'warning'][row.questionType],
          },
          {
            default: () => ['单选题', '多选题', '判断题', '填空题'][row.questionType],
          },
        )
      },
    },
    {
      title: '答案',
      key: 'correctAnswer',
      render(row) {
        if (row.questionType === 0) {
          return h(NTag, { type: 'primary' }, { default: () => row.correctAnswer })
        } else if (row.questionType === 1) {
          return h(NTag, { type: 'success' }, { default: () => row.correctAnswer })
        } else if (row.questionType === 2) {
          return h(
            NTag,
            { type: row.correctAnswer === '1' ? 'success' : 'error' },
            { default: () => (row.correctAnswer === '1' ? '对' : '错') },
          )
        } else if (row.questionType == 3) {
          return h(NTag, { type: 'warning' }, { default: () => row.correctAnswer })
        }
      },
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => sendMail(row),
          },
          { default: () => 'Send Email' },
        )
      },
    },
  ]
}
