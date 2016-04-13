import alt from '../alt';
import TasksActions from '../actions/TasksActions';

class TasksStore {
  constructor() {
    this.bindActions(TasksActions);
    this.sidebar = {
      title: "任务",
      searchbar: {onSearch: ()=>{}},
      sections: [
        {
          header: {label: '工作台'},
          body: [
            {label: '我的任务', icon: 'tasks', to: '/tasks/my'},
            {label: '我参与的任务', icon: 'briefcase', to: '/tasks/follow'},
            {label: '任务日历', icon: 'calendar', to: '/tasks/calendar'},
          ]
        },
        {
          header: {label: '项目'},
          body: []
        },
      ]
    };
  }
}

export default alt.createStore(TasksStore);