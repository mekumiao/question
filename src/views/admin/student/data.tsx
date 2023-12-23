import type { Student } from '@/api/students'
import { NButton, NButtonGroup } from 'naive-ui'
import { type DataTableColumns } from 'naive-ui'

export function createColumns({
  edit,
}: {
  edit?: (rowData: Student) => void
  remove?: (rowData: Student) => void
}): DataTableColumns<Student> {
  return [
    {
      title: '学生名称',
      key: 'name',
    },
    {
      title: '用户名称',
      key: 'userName',
    },
    {
      title: '邮箱',
      key: 'email',
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
          </NButtonGroup>
        )
      },
    },
  ]
}
