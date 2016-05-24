export const myTaskFilters = [
  {
    query: 'uncompleted', name: '按处理优先级', grouper: 'entry', groupConfig: { 0: '收件箱', 1: '正在做', 2: '下一步做' }
  },
  {
    query: 'uncompleted', name: '按项目', grouper: task => task.project ? task.project.projectName : '未分配项目'
  },
  {
    query: 'completed', name: '已完成任务'
  },
  {
    query: 'all', name: '所有任务'
  }
]