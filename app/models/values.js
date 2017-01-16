import moment from 'moment';

export const taskTreat = {
  0: { name: '新任务' },
  10: { name: '进行中', style: 'success' },
  20: { name: '下一步做', collapsed: true, style: 'info' },
  30: { name: '以后再做', collapsed: true, style: 'warning' },
}

export const myTaskFilters = [
  {
    query: 'uncompleted', name: '待处理任务', mode: 'pad',
    grouper: 'treat', groupConfig: taskTreat
  },
  {
    query: 'all', name: '所有任务', mode: 'pad',
    grouper: 'treat', groupConfig: taskTreat
  },
  {
    query: 'uncompleted', name: '按处理优先级',
    grouper: 'treat', groupConfig: taskTreat
  },
  {
    query: 'uncompleted', name: '按项目',
    grouper: task => task.project ? task.project.name : '未分配项目'
  },
]

export const projectTaskFilters = [
  {
    query: 'uncompleted', name: '待处理任务', mode: 'pad',
    grouper: 'treat', groupConfig: taskTreat
  },
  {
    query: 'all', name: '所有任务', mode: 'pad',
    grouper: 'treat', groupConfig: taskTreat
  },
  {
    query: 'uncompleted', name: '按人员',
    grouper: task => task.owner ? task.owner.name : '未分配人员'
  },
  {
    query: 'uncompleted', name: '按截止日期',
    grouper: task => task.dueDate ? moment(task.dueDate).fromNow() : '无截止日期'
  },
  {
    query: 'completed', name: '已完成任务'
  },
]

export const taskCalendarFilters = [
  { query: 'uncompleted', name: '未完成任务' },
  { query: 'all', name: '所有任务' }
]