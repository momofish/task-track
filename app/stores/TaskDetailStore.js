import {assign} from 'lodash';
import alt from '../alt';
import TaskDetailActions from '../actions/TaskDetailActions';

class TaskDetailStore {
  constructor() {
    this.bindActions(TaskDetailActions);
    
    this.task = null;
    this.updated = null;
    this.quick = {title: ''};
  }
  
  getTaskSuccess(task) {
    this.task = task;
    this.updated = null;
  }
  
  updateTaskSuccess(task) {
    this.updated = true;
    assign(this.task, task);
    this.quick.title = '';
  }

  deleteTaskSuccess(task) {
    this.updated = true;
  }
}

export default alt.createStore(TaskDetailStore);