import moment from 'moment';
import alt from '../alt';
import MyTaskActions from '../actions/MyTaskActions';
import {myTaskFilters} from '../models';
import _ from 'underscore';

const task2Item = task => (
  {
    label: task.title,
    completed: task.completed,
    tags: [
      { label: (task.project || {}).projectName, type: "label", style: "success" },
      { label: task.dueDate && moment(task.dueDate).format('L'), type: "label", style: "danger" },
    ],
    originData: task
  });

class MyTaskStore {
  constructor() {
    this.bindActions(MyTaskActions);

    this.quickAddTitle = '';
    this.tasks = [];
    this.taskGroups = [];
    this.showingTask = null;
    this.filter = myTaskFilters[0];
  }

  task2Groups() {
    let {grouper, groupConfig} = this.filter;
    let realGrouper = grouper instanceof Function ? grouper : task => task[grouper] || 0;
    let groups = _.chain(this.tasks).groupBy(realGrouper)
      .mapObject((value, key) => ({
        header: { label: grouper ? groupConfig ? groupConfig[key] : key : this.filter.name }, body: value.map(task2Item)
      })).toArray().value();

    return groups;
  }

  onGetMyTasksSuccess(tasks) {
    this.tasks = tasks;
    this.taskGroups = this.task2Groups();
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

  onSetTask(task) {
    this.showingTask = task;
  }

  onSelectedFilter(filter) {
    this.filter = filter;
    this.taskGroups = this.task2Groups();
  }
}

export default alt.createStore(MyTaskStore);