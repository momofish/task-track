import {assign, contains} from 'lodash';
import moment from 'moment';
import alt from '../alt';
import CalendarActions from '../actions/CalendarActions';
import {taskCalendarFilters} from '../models';

class CalendarStore {
  constructor() {
    this.bindActions(CalendarActions);

    this.category = 'mypart';
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
        title: `${task.title}`,
        allDay: true,
        start: start && moment(start),
        end: end && moment(end).add(1, 'd'),
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