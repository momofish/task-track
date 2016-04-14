import alt from '../alt';
import MyTaskActions from '../actions/MyTaskActions';

class MyTaskStore {
  constructor() {
    this.bindActions(MyTaskActions);
    
    this.data = [];
  }
  
  onGetMyTasksSuccess(data) {
    this.data = data;
  }
}

export default alt.createStore(MyTaskStore);