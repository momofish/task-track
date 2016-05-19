import alt from '../alt';
import {projectService} from '../services';

class TasksActions {
  constructor() {
    this.generateActions(
      'getMyProjectsSuccess'
    );
  }

  getMyProjects() {
    projectService.getMyProjects()
      .then((projects) => this.actions.getMyProjectsSuccess(projects));
  }
}

export default alt.createActions(TasksActions);