import moment from 'moment';
import alt from '../alt';
import MyTaskActions from '../actions/MyTaskActions';
import {myTaskFilters} from '../models';
import _ from 'underscore';

class MyTaskStore {
  constructor() {
    this.bindActions(MyTaskActions);

    this.quickAdd = { title: '' };
    this.tasks = [];
    this.taskGroups = [];
    this.showingTask = null;
    this.filter = myTaskFilters[0];
    this.category = 'my';
  }

  task2Groups() {
    let {query, grouper, groupConfig} = this.filter;
    let realGrouper = grouper instanceof Function ?
      grouper : task => task[grouper] || 0;
    let groups = _.chain(this.tasks).groupBy(realGrouper)
      .mapObject((value, key) => ({
        header: {
          label: grouper ? groupConfig ? groupConfig[key].name : key : this.filter.name
        },
        collapsed: groupConfig && groupConfig[key].collapsed,
        body: value.map(task => {
          return {
            label: task.title,
            completed: task.completed,
            tags: [
              { type: "label", label: (task.project || {}).projectName, style: "success" },
              { type: "label", label: task.dueDate && moment(task.dueDate).format('L'), style: "danger" },
              grouper === 'treat' && { code: 'treat', type: "label", icon: 'flag', style: groupConfig[key].style || 'default', data: task.treat || 0 },
            ],
            data: task
          }
        })
      })).toArray().value();

    return groups;
  }

  onGetMyTasksSuccess({category, tasks}) {
    this.category = category;
    this.tasks = tasks;
    this.taskGroups = this.task2Groups();
  }

  onAddTaskSuccess() {
    this.quickAdd.title = '';
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

  onUpdateTaskDetailSuccess(task) {
    onSelectedFilter(this.filter);
  }
}

export default alt.createStore(MyTaskStore);