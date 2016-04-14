import {assign, contains} from 'underscore';
import alt from '../alt';
import CalendarActions from '../actions/CalendarActions';

class CalendarStore {
  constructor() {
    this.bindActions(CalendarActions);
  }
}

export default alt.createStore(CalendarStore);