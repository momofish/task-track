import alt from '../alt';
import {taskService} from '../services';
import {myTaskFilters} from '../models';
import {select} from '../utils';

class MyTaskActions {
  constructor() {
    this.generateActions(
      'getMyTasksSuccess',
      'addTaskSuccess',
      'addTaskFail',
      'setTask',
      'selectedFilter'
    );
  }

  getMyTasks(filter = 'uncompleted') {
    taskService.getMyTasks(filter)
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

  selectFilter(target, filter) {
    select.selectMenu(target, filter, (newFilter) => {
      this.actions.selectedFilter(newFilter);
      if (filter.query != newFilter.query) {
        this.actions.getMyTasks(newFilter.query);
      }
    }, {align: 'right', data: myTaskFilters});
  }
}

export default alt.createActions(MyTaskActions);