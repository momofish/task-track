import alt from '../alt';

class TasksActions {
  constructor() {
    this.generateActions(
      'gotoMain'
    );
  }
  
  gotoMain(payload){
    this.actions.gotoMain(payload);
  }
}

export default alt.createActions(TasksActions);