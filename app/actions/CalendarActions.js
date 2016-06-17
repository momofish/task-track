import alt from '../alt';
import CalendarStore from '../stores/CalendarStore';
import {taskService} from '../services';
import {taskCalendarFilters} from '../models';
import {select} from '../utils';

class CalendarActions {
  constructor() {
    this.generateActions(
      'getTasksSuccess',
      'selectTask',
      'selectedFilter'
    );
  }

  selectFilter(target, filter) {
    select.selectMenu(target, filter, (newFilter) => {
      this.actions.selectedFilter(newFilter);
      if (filter.query != newFilter.query) {
        this.actions.getTasks();
      }
    }, {align: 'right', data: taskCalendarFilters});
  }

  getTasks() {
    let state = CalendarStore.state;

    taskService.getTasks(state.category, state.filter.query)
      .then(tasks => this.actions.getTasksSuccess(tasks));
  }
}

export default alt.createActions(CalendarActions);