import alt from '../alt';
import moment from 'moment';

class MyTaskActions {
  constructor() {
    this.generateActions(
      'getMyTasksSuccess'
    );
  }
  
  getMyTasks() {
    function task2Entry(tasks) {
      var entries = [{header:{label: '收件箱'},body:tasks.map(task => (
          {
            label:task.title,
            tags:[
              {label:(task.project || {}).projectName, type:"label", style:"success"},
              {label:moment(task.dueDate).format('L'), type:"label", style:"danger"},
            ]
          }
        )
      )}];
      return entries;
    }
    
    $.ajax({url: '/api/tasks/my'})
      .done(data => {
        this.actions.getMyTasksSuccess(task2Entry(data));
      });
  }
  
  addTask(task) {
    $.ajax({type: 'PUT', url: '/api/tasks', data: task}).done(function(){
      this.actions.getMyTasks();
    });
  }
}

export default alt.createActions(MyTaskActions);