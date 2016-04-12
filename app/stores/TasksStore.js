import alt from '../alt';
import TasksActions from '../actions/TasksActions';

class TasksStore {
  constructor() {
    this.bindActions(TasksActions);
    this.characters = [];
  }
}

export default alt.createStore(TasksStore);