import moment from 'moment';
import alt from '../alt';
import MyTaskActions from '../actions/MyTaskActions';
import {myTaskFilterConfig} from '../models';

class MyTaskStore {
  constructor() {
    this.bindActions(MyTaskActions);

    this.quickAddTitle = '';
    this.tasks = [];
    this.showingTask = null;
    this.filters = [
      {name: '按处理优先级', field: 'entry', fieldConfig: {0: '收件箱', 1: '正在做', 2: '下一步做'}}
    ];
    this.filter = {};
  }
  
  task2Entry(data) {
    alert(myTaskFilterConfig)
    var entries = [{
      header: { label: '收件箱' }, body: data.map(task => (
        {
          label: task.title,
          completed: task.completed,
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