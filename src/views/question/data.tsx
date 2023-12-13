import type { Question } from '@/api/questions'
import { NTag, type DataTableColumns, NButton, NButtonGroup } from 'naive-ui'

export function createColumns({
  edit,
}: {
  edit: (rowData: Question) => void
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
    },
    {
      title: '类型',
      key: 'questionType',
      render(row) {
        return (
          // @ts-ignore
          <NTag type={['primary', 'success', 'info', 'warning'][row.questionType]}>
            {['单选题', '多选题', '判断题', '填空题'][row.questionType]}
          </NTag>
        )
      },
    },
    {
      title: '答案',
      key: 'correctAnswer',
      render(row) {
        if (row.questionType === 0) {
          return <NTag type="primary">{row.correctAnswer}</NTag>
        } else if (row.questionType === 1) {
          return <NTag type="success">{row.correctAnswer}</NTag>
        } else if (row.questionType === 2) {
          return (
            <NTag type={row.correctAnswer === '1' ? 'success' : 'error'}>
              {row.correctAnswer === '1' ? '对' : '错'}
            </NTag>
          )
        } else if (row.questionType == 3) {
          return <NTag type="warning">{row.correctAnswer}</NTag>
        }
      },
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return (
          <NButtonGroup>
            <NButton type="info" size="small">
              查看
            </NButton>
            <NButton type="primary" size="small" onClick={() => edit(row)}>
              编辑
            </NButton>
            <NButton type="warning" size="small">
              删除
            </NButton>
          </NButtonGroup>
        )
      },
    },
  ]
}
