import {assign} from 'underscore';
import alt from '../alt';
import TaskDetailActions from '../actions/TaskDetailActions';

class TaskDetailStore {
  constructor() {
    this.bindActions(TaskDetailActions);
    
    this.task = null;
    this.updated = null;
  }
  
  getTaskDetailSuccess(task) {
    this.task = task;
  }
  
  updateTaskDetailSuccess(task) {
    this.task = task;
    this.updated = true;
  }
}

export default alt.createStore(TaskDetailStore);