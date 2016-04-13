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
            {label: '我的任务', icon: 'briefcase', to: '/tasks/my'}
          ]
        }
      ]
    };
  }
}

export default alt.createStore(TasksStore);