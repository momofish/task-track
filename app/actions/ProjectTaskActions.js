import alt from '../alt';
import {taskService, projectService} from '../services';
import ProjectTaskStore from '../stores/ProjectTaskStore'
import {projectTaskFilters} from '../models';
import {select} from '../utils';

class ProjectTaskActions {
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
    projectService.getProject(id)
      .then(project => {
        project.packets.push({active: true, name: "(无)"});
        this.actions.getProjectSuccess(project)
        let state = ProjectTaskStore.state;
        state.packet = project.packets.length ? project.packets[0]._id : null;
        this.actions.getTasks();
      });
  }

  selectPacket(packet) {
    let state = ProjectTaskStore.state;
    state.packet = packet._id;
    this.actions.getTasks();
  }

  getTasks() {
    let {project, filter, packet} = ProjectTaskStore.state;
    taskService.getTasks(`${project._id}_${packet || ''}`, filter.query)
      .then(tasks => this.actions.getTasksSuccess({ tasks }));
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
        this.actions.getTasks(undefined);
      }
    }, { align: 'right', data: projectTaskFilters });
  }

  updateTask(task) {
    taskService.updateTask(task)
      .then(() => this.actions.getTasks());
  }
}

export default alt.createActions(ProjectTaskActions);