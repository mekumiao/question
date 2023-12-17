import type { User } from '@/api/users'
import { NTag, NButton, NButtonGroup, NSpace } from 'naive-ui'
import { type DataTableColumns } from 'naive-ui'

export function createDefaultModel(): User {
  return {
    email: '',
    userId: '',
    userName: '',
    nickName: '',
    roles: [],
  }
}

export function createColumns({
  edit,
  lock,
}: {
  edit?: (rowData: User) => void
  lock?: (rowData: User) => void
}): DataTableColumns<User> {
  return [
    {
      title: '名称',
      key: 'nickName',
    },
    {
      title: '账号',
      key: 'userName',
    },
    {
      title: '角色',
      key: 'roles',
      render(row) {
        return (
          <NSpace>
            {row.roles.map((v) => (
              <NTag type={v === 'admin' ? 'primary' : v === 'student' ? 'warning' : 'default'}>
                {v === 'admin' ? '管理员' : v === 'student' ? '学生' : '默认'}
              </NTag>
            ))}
          </NSpace>
        )
      },
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
            <NButton type="warning" size="small" onClick={() => lock?.(row)}>
              锁定
            </NButton>
          </NButtonGroup>
        )
      },
    },
  ]
}
