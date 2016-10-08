import {assign, contains} from 'lodash';
import moment from 'moment';
import alt from '../alt';
import CalendarActions from '../actions/CalendarActions';
import {taskCalendarFilters} from '../models';

class CalendarStore {
  constructor() {
    this.bindActions(CalendarActions);

    this.category = 'my';
    this.filter = taskCalendarFilters[0];
    this.tasks = [];
    this.events = [];
  }

  task2Events(tasks) {
    return tasks.map(task => {
      let start = task.dueDate, end = task.dueDate;
      if (task.startDate) start = task.startDate;
      if (task.endDate) end = task.endDate;

      return {
        title: task.title,
        allDay: true,
        start: new Date(start),
        end: new Date(end),
        data: task
      }
    });
  }

  selectedFilter(filter) {
    this.filter = filter;
  }

  getTasksSuccess(tasks) {
    this.tasks = tasks;
    this.events = this.task2Events(tasks);
  }

  selectTask(task) {
    this.selectedTask = task;
  }
}

export default alt.createStore(CalendarStore);