import alt from '../alt';

class MyTaskActions {
  constructor() {
    this.generateActions(
      'getMyTasksSuccess'
    );
  }
  
  getMyTasks() {
    
    function task2Entry(tasks) {
      var entries = [{header:{label: '收件箱'},body:tasks.map(task => (
        {label:task.taskTitle,meta:[{label:task.project || '无项目',type:"label",style:"success"}]}
        )
      )}];
      return entries;
    }
    $.ajax({url: '/api/tasks/my'})
      .done(data => {
        this.actions.getMyTasksSuccess(task2Entry(data));
      });
  }
}

export default alt.createActions(MyTaskActions);