import alt from '../alt';
import MyTaskStore from '../stores/MyTaskStore'
import {taskService} from '../services';
import {myTaskFilters} from '../models';
import {select} from '../utils';

class MyTaskActions {
  constructor() {
    this.generateActions(
      'beforeGetTasks',
      'getTasksSuccess',
      'addTaskSuccess',
      'addTaskFail',
      'selectTask',
      'selectedFilter'
    );
  }

  getTasks(category) {
    if (category != null)
      this.actions.beforeGetTasks(category);

    let state = MyTaskStore.state;
    taskService.getTasks(state.category, state.filter.query)
      .then(tasks => this.actions.getTasksSuccess(tasks));
  }

  addTask(task, form) {
    taskService.addTask(task)
      .then((tasks) => {
        this.actions.addTaskSuccess();
        this.actions.getTasks();
      }, (jqXhr) => {
        this.actions.addTaskFail({ jqXhr, form });
      });
  }

  selectFilter(target, filter) {
    select.selectMenu(target, filter, (newFilter) => {
      this.actions.selectedFilter(newFilter);
      if (filter.query != newFilter.query) {
        this.actions.getTasks();
      }
    }, {align: 'right', data: myTaskFilters});
  }
  
  updateTaskDetail(task) {
    taskService.updateTask(task)
      .then(() => this.actions.getTasks());
  }
}

export default alt.createActions(MyTaskActions);