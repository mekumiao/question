import type { AnswerHistory } from '@/api/students'
import type { DataTableColumns } from 'naive-ui'
import { NRate, NButton, NButtonGroup, NPopconfirm, NTag, NTime, NSpace } from 'naive-ui'

export function createDifficultyLevelOptions() {
  return [
    {
      label: '全部',
      value: 0,
    },
    {
      label: '简单',
      value: 1,
    },
    {
      label: '中等',
      value: 2,
    },
    {
      label: '困难',
      value: 3,
    },
  ]
}

export function createDefaultModel() {
  return {
    questionId: 0,
    questionText: '',
    questionType: 0,
    correctAnswer: '',
    options: [],
  }
}

export function createColumns({
  edit,
  remove,
}: {
  edit?: (rowData: AnswerHistory) => void
  remove?: (rowData: AnswerHistory) => void
}): DataTableColumns<AnswerHistory> {
  return [
    {
      title: 'ID',
      key: 'examPaperId',
      width: 80,
    },
    {
      title: '试卷名称',
      key: 'examPaperName',
    },
    {
      title: '难度',
      key: 'difficultyLevel',
      render(row) {
        return <NRate readonly size="small" value={row.difficultyLevel} count={3}></NRate>
      },
    },

    {
      title: '作答时间',
      key: 'difficultyLevel',
      render(row) {
        return (
          <NSpace>
            {{
              default: () => {
                const min = new Date(2023)
                const start = new Date(row.startTime)
                const end = new Date(row.submissionTime)
                return (
                  <>
                    {start > min ? <NTime time={start}></NTime> : '--'}
                    <span>至</span>
                    {end > min ? <NTime time={end}></NTime> : '--'}
                  </>
                )
              },
            }}
          </NSpace>
        )
      },
    },
    {
      title: '已交卷',
      key: 'difficultyLevel',
      render(row) {
        return (
          <NTag size="small" type={row.isSubmission ? 'success' : 'error'}>
            {row.isSubmission ? '是' : '否'}
          </NTag>
        )
      },
    },
    {
      title: '错题数',
      key: 'totalIncorrectAnswers',
    },
    {
      title: '操作',
      key: 'actions',
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
                default: () => `确定删除ID为 "${row.examPaperId}" 的试卷吗？`,
              }}
            </NPopconfirm>
          </NButtonGroup>
        )
      },
    },
  ]
}
