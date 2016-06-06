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

  getMyTasks(category, filter = 'uncompleted') {
    if (category == undefined)
      category = this.alt.stores.MyTaskStore.state.category;
    taskService.getMyTasks(category, filter)
      .then(tasks => this.actions.getMyTasksSuccess({category, tasks}));
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
        this.actions.getMyTasks(undefined, newFilter.query);
      }
    }, {align: 'right', data: myTaskFilters});
  }
  
  updateTaskDetail(task) {
    taskService.updateTask(task)
      .then(() => this.actions.getMyTasks());
  }
}

export default alt.createActions(MyTaskActions);