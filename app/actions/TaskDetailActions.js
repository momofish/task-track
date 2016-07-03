import alt from '../alt';
import {taskService} from '../services';

class TaskDetailActions {
  constructor() {
    this.generateActions(
      'getTaskSuccess',
      'updateTaskSuccess'
    );
  }

  getTask(id) {
    taskService.getTask(id)
      .then(task => {
        this.actions.getTaskSuccess(task);
      });
  }

  updateTask(task, taskPopulated) {
    taskService.updateTask(task)
      .then(() => this.actions.updateTaskSuccess(taskPopulated));
  }

  deleteTask(id) {
    taskService.deleteTask(id)
      .then(() => Modal.close());
  }
}

export default alt.createActions(TaskDetailActions);