import moment from 'moment';
import alt from '../alt';
import MyTaskActions from '../actions/MyTaskActions';

class MyTaskStore {
  constructor() {
    this.bindActions(MyTaskActions);

    this.quickAddTitle = '';
    this.tasks = [];
    this.showingTask = null;
  }
  
  task2Entry(data) {
    var entries = [{
      header: { label: '收件箱' }, body: data.map(task => (
        {
          label: task.title,
          tags: [
            { label: (task.project || {}).projectName, type: "label", style: "success" },
            { label: task.dueDate && moment(task.dueDate).format('L'), type: "label", style: "danger" },
          ],
          originData: task
        }))
      }];
    return entries;
  }

  onGetMyTasksSuccess(data) {
    this.tasks = this.task2Entry(data);
    
    this.showingTask = this.tasks[0].body[0].originData;
  }

  onAddTaskSuccess() {
    this.quickAddTitle = '';
  }

  onAddTaskFail(payload) {
    toastr.error(payload.jqXhr.responseJSON.message);
    
    var form = payload.form;
    form.classList.add('shake');
    setTimeout(() => {
      form.classList.remove('shake');
    }, 500);
  }
  
  onShowTask(task) {
    this.showingTask = task;
  }
}

export default alt.createStore(MyTaskStore);