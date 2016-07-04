import {assign} from 'underscore';
import alt from '../alt';
import TaskDetailActions from '../actions/TaskDetailActions';

class TaskDetailStore {
  constructor() {
    this.bindActions(TaskDetailActions);
    
    this.task = null;
    this.updated = null;
  }
  
  getTaskSuccess(task) {
    this.task = task;
    this.updated = null;
  }
  
  updateTaskSuccess(task) {
    this.updated = true;
    assign(this.task, task);
  }

  deleteTaskSuccess(task) {
    this.updated = true;
  }
}

export default alt.createStore(TaskDetailStore);