import alt from '../alt';
import {taskService} from '../services';

class TaskDetailActions {
  constructor() {
    this.generateActions(
      'getTaskDetailSuccess',
      'updateTaskDetailSuccess'
    );
  }

  getTaskDetail(id) {
    taskService.getTaskDetail(id)
      .then(task => {
        this.actions.getTaskDetailSuccess(task);
      });
  }

  updateTaskDetail(task) {
    taskService.updateTask(task)
      .then(newTask => this.actions.getTaskDetail(task._id));
  }
}

export default alt.createActions(TaskDetailActions);