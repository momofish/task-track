import {assign} from 'underscore';
import alt from '../alt';
import TaskDetailActions from '../actions/TaskDetailActions';

class TaskDetailStore {
  constructor() {
    this.bindActions(TaskDetailActions);
    
    this.task = null;
    this.updated = null;
  }
  
  onGetTaskDetailSuccess(task) {
    this.task = task;
    this.updated = null;
  }
  
  onUpdateTaskDetailSuccess(task) {
    this.updated = true;
    assign(this.task, task);
  }
}

export default alt.createStore(TaskDetailStore);