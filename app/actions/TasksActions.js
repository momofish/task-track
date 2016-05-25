import alt from '../alt';
import {projectService} from '../services';

class TasksActions {
  constructor() {
    this.generateActions(
      'getMyPartProjectsSuccess'
    );
  }

  getMyPartProjects() {
    projectService.getMyPartProjects()
      .then((projects) => this.actions.getMyPartProjectsSuccess(projects));
  }
}

export default alt.createActions(TasksActions);