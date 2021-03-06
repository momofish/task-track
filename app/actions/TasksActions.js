import alt from '../alt';
import {teamService, projectService} from '../services';

class TasksActions {
  constructor() {
    this.generateActions(
      'getProjectsSuccess'
    );
  }

  getProjects(opener) {
    teamService.getMyPartTeams()
      .then(teams => {
        projectService.getMyPartProjects()
          .then(projects => this.actions.getProjectsSuccess({teams, projects, opener}));
      });
  }
}

export default alt.createActions(TasksActions);