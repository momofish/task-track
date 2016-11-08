import moment from 'moment';
import _ from 'lodash';

import alt from '../alt';
import MyTaskActions from '../actions/MyTaskActions';
import {myTaskFilters} from '../models';
import {projectService} from '../services'

class MyTaskStore {
  constructor() {
    this.bindActions(MyTaskActions);

    this.quickAdd = { title: '' };
    this.tasks = [];
    this.taskGroups = [];
    this.selectedTask = null;
    this.filter = myTaskFilters[0];
    this.category = 'my';
  }

  task2Groups() {
    let {query, grouper, groupConfig} = this.filter;
    let realGrouper = grouper instanceof Function ?
      grouper : task => task[grouper] || 0;
    let groups = _.chain(this.tasks).groupBy(realGrouper)
      .mapValues((value, key) => ({
        header: {
          label: grouper ? groupConfig ? groupConfig[key].name : key : this.filter.name
        },
        collapsed: groupConfig && groupConfig[key].collapsed,
        body: value.map(task => {
          return {
            label: task.title,
            description: task.description,
            completed: task.completed,
            checked: task.completed,
            tags: [
              { code: 'project', type: 'label', label: projectService.formatProjectName(task.project), style: 'success', data: task.project },
              { code: 'dueDate', type: 'label', label: task.dueDate && moment(task.dueDate).format('L'), style: 'danger', data: task.dueDate },
              grouper === 'treat' && { code: 'treat', type: 'label', icon: 'flag', style: groupConfig[key].style || 'default', data: task.treat || 0 },
            ],
            data: task
          }
        })
      })).toArray().value();

    return groups;
  }

  beforeGetTasks(category) {
    this.category = category;
  }

  getTasksSuccess(tasks) {
    this.tasks = tasks;
    this.taskGroups = this.task2Groups();
  }

  addTaskSuccess() {
    this.quickAdd.title = '';
  }

  addTaskFail(payload) {
    toastr.error(payload.jqXhr.responseJSON.message);

    let form = payload.form;
    form.classList.add('shake');
    setTimeout(() => {
      form.classList.remove('shake');
    }, 500);
  }

  selectTask(task) {
    this.selectedTask = task;
  }

  selectedFilter(filter) {
    this.filter = filter;
    this.taskGroups = this.task2Groups();
  }

  updateTaskSuccess(task) {
    onSelectedFilter(this.filter);
  }
}

export default alt.createStore(MyTaskStore);