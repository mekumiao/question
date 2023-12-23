import type { ExamPaper } from '@/api/examPapers'
import type { DataTableColumns } from 'naive-ui'
import { NRate, NButton, NButtonGroup, NPopconfirm } from 'naive-ui'

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
  edit?: (rowData: ExamPaper) => void
  remove?: (rowData: ExamPaper) => void
}): DataTableColumns<ExamPaper> {
  return [
    {
      type: 'selection',
    },
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
                default: () => `确定删除ID为 "${row.examPaperId}" 的试卷吗？`,
              }}
            </NPopconfirm>
          </NButtonGroup>
        )
      },
    },
  ]
}
