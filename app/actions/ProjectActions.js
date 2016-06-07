import alt from '../alt';
import {taskService, projectService} from '../services';
import {taskFilters} from '../models';
import {select} from '../utils';

class ProjectActions {
  constructor() {
    this.generateActions(
      'beforeGetProject',
      'getProjectSuccess',
      'getTasksSuccess',
      'addTaskSuccess',
      'addTaskFail',
      'selectTask',
      'selectedFilter'
    );
  }

  getProject(id, filter) {
    this.actions.beforeGetProject(id);
    this.actions.getTasks();
    projectService.getProject(id)
      .then(project => this.actions.getProjectSuccess(project));
  }

  getTasks() {
    let state = this.alt.stores.ProjectStore.state;
    taskService.getTasks(state.project._id, state.filter.query)
      .then(tasks => this.actions.getTasksSuccess({tasks}));
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
        this.actions.getTasks(undefined, newFilter.query);
      }
    }, {align: 'right', data: taskFilters});
  }
  
  updateTaskDetail(task) {
    taskService.updateTask(task)
      .then(() => this.actions.getTasks());
  }
}

export default alt.createActions(ProjectActions);