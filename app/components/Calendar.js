import React from 'react';
import CalendarStore from '../stores/CalendarStore';
import CalendarActions from '../actions/CalendarActions'

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = CalendarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    CalendarStore.listen(this.onChange);
  }

  componentWillUnmount() {
    CalendarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container-fluid'>
      </div>
    );
  }
}

export default Calendar;