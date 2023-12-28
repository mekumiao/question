import type { Examination } from '@/api/examination'
import type { DataTableColumns } from 'naive-ui'
import { NRate, NButton, NButtonGroup, NPopconfirm, NTag } from 'naive-ui'
import { formatSeconds } from '@/utils'
import { RouterLink } from 'vue-router'

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

export function createExaminationTypeOptions() {
  return [
    {
      label: '全部',
      value: 0,
    },
    {
      label: '正常考试',
      value: 1,
    },
    {
      label: '模拟考试',
      value: 2,
    },
  ]
}

export function createColumns({
  edit,
  remove,
}: {
  edit?: (rowData: Examination) => void
  remove?: (rowData: Examination) => void
}): DataTableColumns<Examination> {
  return [
    {
      type: 'selection',
    },
    {
      title: 'ID',
      key: 'examinationId',
      width: 80,
    },
    {
      title: '考试名称',
      key: 'examinationName',
    },
    {
      title: '试卷',
      key: 'examPaperName',
    },
    {
      title: '发布',
      key: 'isPublish',
      render(row) {
        return row.isPublish ? (
          <NTag size="small" type="primary">
            已发布
          </NTag>
        ) : (
          <NTag size="small" type="info">
            未发布
          </NTag>
        )
      },
    },
    {
      title: '类型',
      key: 'examinationType',
      render(row) {
        return row.examinationType === 1 ? (
          <NTag size="small" type="success">
            考试
          </NTag>
        ) : row.examinationType === 2 ? (
          <NTag size="small" type="info">
            模拟
          </NTag>
        ) : (
          <NTag size="small" type="default">
            默认
          </NTag>
        )
      },
    },
    {
      title: '时长',
      key: 'DurationSeconds',
      render(row) {
        return (
          <NTag size="small" type="default">
            {formatSeconds(row.durationSeconds)}
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
      title: '排序',
      key: 'order',
      render(row) {
        return (
          <NTag size="small" type="info">
            {row.order}
          </NTag>
        )
      },
    },
    {
      title: '考试人数',
      key: 'examParticipantCount',
      render(row) {
        return (
          <RouterLink
            to={{
              path: `/admin/history/`,
              query: {
                examinationId: row.examinationId,
                examinationName: row.examinationName,
              },
            }}
          >
            <NButton size="small" dashed type="info">
              {row.examParticipantCount}
            </NButton>
          </RouterLink>
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
