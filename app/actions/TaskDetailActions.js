import alt from '../alt';
import {taskService} from '../services';

class TaskDetailActions {
  constructor() {
    this.generateActions(
      'getTaskSuccess',
      'updateTaskSuccess',
      'deleteTaskSuccess'
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
      .then((result) => this.actions.updateTaskSuccess(result));
  }

  deleteTask({id, component}) {
    taskService.deleteTask(id)
      .then(() => {
        this.actions.deleteTaskSuccess();
        $(component.refs.modal.refs.modal).modal('hide');
      });
  }
}

export default alt.createActions(TaskDetailActions);