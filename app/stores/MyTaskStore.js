import alt from '../alt';
import MyTaskActions from '../actions/MyTaskActions';

class MyTaskStore {
  constructor() {
    this.bindActions(MyTaskActions);
    
    this.quickAddTitle = '';
    this.data = [];
  }
  
  onGetMyTasksSuccess(data) {
    this.data = data;
  }
  
  onAddTaskSuccess() {
    this.quickAddTitle = '';
  }
}

export default alt.createStore(MyTaskStore);