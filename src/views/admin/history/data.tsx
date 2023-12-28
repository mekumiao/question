import type { AnswerHistory } from '@/api/answerHistory'
import type { Student } from '@/api/students'
import type { DataTableColumns } from 'naive-ui'
import { NRate, NButton, NButtonGroup, NTag, NPopconfirm, NSpace } from 'naive-ui'
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

export function createDefaultModel() {
  return {
    questionId: 0,
    questionText: '',
    questionType: 0,
    correctAnswer: '',
    options: [],
  }
}

export function createColumns(): DataTableColumns<AnswerHistory> {
  return [
    {
      type: 'selection',
    },
    {
      title: 'ID',
      key: 'answerHistoryId',
      width: 80,
    },
    {
      title: '考试名称',
      key: 'examinationName',
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
      title: '题目总数',
      key: 'totalQuestions',
    },
    {
      title: '作答总数',
      key: 'totalNumberAnswers',
    },
    {
      title: '类别',
      key: 'examinationType',
      render(row) {
        if (row.examinationType === 1) {
          return (
            <NTag size="small" type="success">
              考试
            </NTag>
          )
        } else if (row.examinationType === 2) {
          return (
            <NTag size="small" type="info">
              模拟
            </NTag>
          )
        } else {
          return (
            <NTag size="small" type="warning">
              练习
            </NTag>
          )
        }
      },
    },
    {
      title: '已交卷',
      key: 'isSubmission',
      render(row) {
        return row.isTimeout ? (
          <NTag size="small" type="error">
            超时
          </NTag>
        ) : (
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
      align: 'right',
      render(row) {
        return (
          <NButtonGroup>
            <RouterLink to={`/student/answer-detail/${row.answerHistoryId}`}>
              <NButton ghost type="primary" size="small">
                查看详细
              </NButton>
            </RouterLink>
          </NButtonGroup>
        )
      },
    },
  ]
}

/**
 * 创建学生列
 * @returns
 */
export function createStudentColumns({
  reset,
}: {
  reset?: (rowData: Student) => void
}): DataTableColumns<Student> {
  return [
    {
      type: 'selection',
    },
    {
      title: 'ID',
      key: 'userId',
    },
    {
      title: '用户名',
      key: 'studentName',
    },
    {
      title: '答题率',
      key: 'answerRate',
      render(row) {
        return (
          <NTag size="small" type="info">
            {Math.round(row.answerRate * 100)}%
          </NTag>
        )
      },
    },
    {
      title: '错题率',
      key: 'incorrectRate',
      render(row) {
        return (
          <NTag size="small" type="warning">
            {Math.round(row.incorrectRate * 100)}%
          </NTag>
        )
      },
    },
    {
      title: '考试次数',
      key: 'totalExamParticipations',
    },
    {
      title: '练习次数',
      key: 'totalPracticeSessions',
    },
    {
      title: '操作',
      key: 'actions',
      align: 'right',
      render(row) {
        return (
          <NButtonGroup size="small">
            <NSpace>
              <NPopconfirm onPositiveClick={() => reset?.(row)}>
                {{
                  trigger: () => (
                    <NButton ghost type="warning">
                      重置
                    </NButton>
                  ),
                  default: () => `确定重置用户 ${row.userId} 的答题汇总数据吗？`,
                }}
              </NPopconfirm>
              <RouterLink to={`/admin/history/${row.studentId}`}>
                <NButton ghost type="info">
                  查看详细
                </NButton>
              </RouterLink>
            </NSpace>
          </NButtonGroup>
        )
      },
    },
  ]
}
