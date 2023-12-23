import type { Question } from '@/api/questions'
import { NTag, NButton, NButtonGroup, NPopconfirm, NRate } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

export function createQuestionTypeOptions() {
  return [
    {
      label: '全部',
      value: 0,
    },
    {
      label: '单选题',
      value: 1,
    },
    {
      label: '多选题',
      value: 2,
    },
    {
      label: '判断题',
      value: 3,
    },
    {
      label: '填空题',
      value: 4,
    },
  ]
}

export function createDefaultModel(): Question {
  return {
    questionId: 0,
    questionText: '',
    questionType: 0,
    correctAnswer: '',
    difficultyLevel: 0,
    options: [],
  }
}

export function createColumns({
  edit,
  remove,
}: {
  edit?: (rowData: Question) => void
  remove?: (rowData: Question) => void
}): DataTableColumns<Question> {
  return [
    {
      title: 'ID',
      key: 'questionId',
      width: 80,
    },
    {
      title: '题目',
      key: 'questionText',
      render(row) {
        return <div class="w-10 truncate md:w-24 xl:w-36">{row.questionText}</div>
      },
    },
    {
      title: '类型',
      key: 'questionType',
      render(row) {
        return (
          // @ts-ignore
          <NTag type={['default', 'primary', 'success', 'info', 'warning'][row.questionType]}>
            {['未知', '单选题', '多选题', '判断题', '填空题'][row.questionType]}
          </NTag>
        )
      },
    },
    {
      title: '难度',
      key: 'difficultyLevel',
      render(row) {
        return <NRate readonly size="small" value={row.difficultyLevel} count={3}></NRate>
      },
    },
    {
      title: '答案',
      key: 'correctAnswer',
      render(row) {
        if (row.questionType === 1) {
          return (
            <NTag round type="primary">
              {row.correctAnswer}
            </NTag>
          )
        } else if (row.questionType === 2) {
          return <NTag type="success">{row.correctAnswer}</NTag>
        } else if (row.questionType === 3) {
          return (
            <NTag type={row.correctAnswer === '1' ? 'success' : 'error'}>
              {row.correctAnswer === '1' ? '√' : '×'}
            </NTag>
          )
        } else if (row.questionType == 4) {
          return (
            <NTag class="truncate" style={{ maxWidth: '10rem' }} type="warning">
              {row.correctAnswer}
            </NTag>
          )
        }
      },
    },
    {
      title: '操作',
      key: 'actions',
      align: 'right',
      render(row) {
        return (
          <NButtonGroup>
            <NButton type="primary" size="small" onClick={() => edit?.(row)}>
              编辑
            </NButton>
            <NPopconfirm onPositiveClick={() => remove?.(row)}>
              {{
                trigger: () => (
                  <NButton type="warning" size="small">
                    删除
                  </NButton>
                ),
                default: () => `确定删除ID为 "${row.questionId}" 的题目吗？`,
              }}
            </NPopconfirm>
          </NButtonGroup>
        )
      },
    },
  ]
}
