import {assign} from 'underscore';
import alt from '../alt';
import TaskDetailActions from '../actions/TaskDetailActions';

class TaskDetailStore {
  constructor() {
    this.bindActions(TaskDetailActions);
  }
  
  getTaskSuccess(task) {
    this.task = task;
  }
}

export default alt.createStore(TaskDetailStore);