import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import TaskDetail from './TaskDetail';
import Store from '../stores/CalendarStore';
import Actions from '../actions/CalendarActions'
import {Icon} from './common';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = Store.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);

    Actions.getTasks();
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  selectFilter(event) {
    Actions.selectFilter(event.target, this.state.filter);
  }

  selectTask(task) {
    Actions.selectTask(task);
  }

  render() {
    let {selectedTask, events} = this.state;
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <Icon icon='calendar' /> 任务日历
          </h2>
          <div className="btn-group pull-right" onClick={this.selectFilter.bind(this) }>
            <button type="button" className="btn btn-info" disabled>
              <span className="glyphicon glyphicon-list-alt" />
            </button>
            <button type="button" className="btn btn-default" style={{ width: 180 }}>
              {this.state.filter.name} <i className="caret" />
            </button>
          </div>
        </div>
        <BigCalendar className='flex-scroll calendar' selectable events={events}
          views={['month', 'week', 'agenda']}
          onSelectEvent={event => this.selectTask(event.data) }
          />
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          Actions.selectTask();
          updated && Actions.getTasks();
        } } />}
      </div>
    );
  }
}

export default Calendar;