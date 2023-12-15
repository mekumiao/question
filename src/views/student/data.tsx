import type { User } from '@/api/users'
import { NButton, NButtonGroup } from 'naive-ui'
import { type DataTableColumns } from 'naive-ui'

export function createDefaultModel(): User {
  return {
    email: '',
    userId: '',
    userName: '',
    roles: [],
  }
}

export function createColumns({
  edit,
}: {
  edit?: (rowData: User) => void
  remove?: (rowData: User) => void
}): DataTableColumns<User> {
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
