import alt from '../alt';
import {taskService} from '../services';

class MyTaskActions {
  constructor() {
    this.generateActions(
      'getMyTasksSuccess',
      'addTaskSuccess',
      'addTaskFail',
      'showTask'
    );
  }

  getMyTasks() {
    taskService.getMyTasks()
      .then((tasks) => this.actions.getMyTasksSuccess(tasks));
  }

  addTask(task, form) {
    taskService.addTask(task)
      .then((tasks) => {
        this.actions.addTaskSuccess();
        this.actions.getMyTasks();
      }, (jqXhr) => {
        this.actions.addTaskFail({ jqXhr, form });
      });
  }
}

export default alt.createActions(MyTaskActions);