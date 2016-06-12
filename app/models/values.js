import moment from 'moment';

export const taskTreat = {
  0: { name: '收件箱' },
  10: { name: '现在做', style: 'success' },
  20: { name: '下一步做', collapsed: true, style: 'info' },
  30: { name: '将来做', collapsed: true, style: 'warning' },
}

export const myTaskFilters = [
  {
    query: 'uncompleted', name: '按处理优先级', 
    grouper: 'treat', groupConfig: taskTreat
  },
  {
    query: 'uncompleted', name: '按项目',
    grouper: task => task.project ? task.project.name : '未分配项目'
  },
  {
    query: 'completed', name: '已完成任务'
  },
  {
    query: 'all', name: '所有任务'
  }
]

export const taskFilters = [
  {
    query: 'uncompleted', name: '按处理优先级', 
    grouper: 'treat', groupConfig: taskTreat
  },
  {
    query: 'uncompleted', name: '按分配',
    grouper: task => task.assignee ? task.assignee.name : '未分配人员'
  },
  {
    query: 'uncompleted', name: '按截止日期',
    grouper: task => task.dueDate ? moment(task.dueDate).fromNow() : '无截止日期'
  },
  {
    query: 'completed', name: '已完成任务'
  },
  {
    query: 'all', name: '所有任务'
  }
]