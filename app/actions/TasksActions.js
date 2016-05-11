import alt from '../alt';

class TasksActions {
  constructor() {
    this.generateActions(
      'getMyProjectsSuccess'
    );
  }
  
  getMyProjects() {
    $.ajax({url: '/api/projects/my'})
      .done(data => {
        this.actions.getMyProjectsSuccess(data);
      });
  }
}

export default alt.createActions(TasksActions);