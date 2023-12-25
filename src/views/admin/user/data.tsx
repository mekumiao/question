import type { User } from '@/api/users'
import { NTag, NButton, NButtonGroup, NSpace, NAvatar } from 'naive-ui'
import { type DataTableColumns } from 'naive-ui'
import jdg from '@/assets/img/jdg.png'

export function createDefaultModel(): User {
  return {
    email: '',
    userId: 0,
    userName: '',
    nickName: '',
    avatar: null,
    createTime: null,
    roles: [],
    lockoutEnabled: false,
  }
}

export function createColumns({
  edit,
  lock,
}: {
  edit?: (rowData: User) => void
  lock?: (rowData: User, lockoutEnabled: boolean) => void
}): DataTableColumns<User> {
  return [
    {
      title: 'ID',
      key: 'userId',
    },
    {
      title: '名称',
      key: 'nickName',
    },
    {
      // 邮箱就是账号
      title: '邮箱',
      key: 'userName',
    },
    {
      title: '头像',
      key: 'roles',
      render(row) {
        return (
          <NAvatar round size="small" src={row.avatar || jdg}>
            {{
              placeholder: () => 'xxxxx',
              fallback: () => 'tttttt',
            }}
          </NAvatar>
        )
      },
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
      title: '操作',
      key: 'actions',
      align: 'right',
      render(row) {
        return (
          <NButtonGroup>
            <NButton type="primary" size="small" onClick={() => edit?.(row)}>
              编辑
            </NButton>

            {row.lockoutEnabled ? (
              <NButton type="info" size="small" onClick={() => lock?.(row, false)}>
                解锁
              </NButton>
            ) : (
              <NButton type="warning" size="small" onClick={() => lock?.(row, true)}>
                锁定
              </NButton>
            )}
          </NButtonGroup>
        )
      },
    },
  ]
}
