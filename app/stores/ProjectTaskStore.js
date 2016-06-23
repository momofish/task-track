import moment from 'moment';
import alt from '../alt';
import Actions from '../actions/ProjectTaskActions';
import {projectTaskFilters} from '../models';
import _ from 'underscore';

class ProjectTaskStore {
  constructor() {
    this.bindActions(Actions);

    this.quickAdd = { title: '' };
    this.project = {};
    this.tasks = [];
    this.taskGroups = [];
    this.selectedTask = null;
    this.filter = projectTaskFilters[0];
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
        body: value.map(task => {
          return {
            label: task.title,
            completed: task.completed,
            tags: [
              { code: 'dueDate', type: "label", label: task.dueDate && moment(task.dueDate).format('L'), style: "danger", data: task.dueDate },
              task.owner && { code: 'owner', type: "label", label: task.owner.name, style: "info", data: task.owner },
              grouper === 'treat' && { code: 'treat', type: "label", icon: 'flag', style: groupConfig[key].style || 'default', data: task.treat || 0 },
            ],
            data: task
          }
        })
      })).toArray().value();

    return groups;
  }

  beforeGetProject(id) {
    this.project._id = id;
  }

  getProjectSuccess(project) {
    this.project = project;
  }

  getTasksSuccess({id, tasks}) {
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

  updateTaskDetailSuccess(task) {
    onSelectedFilter(this.filter);
  }
}

export default alt.createStore(ProjectTaskStore);