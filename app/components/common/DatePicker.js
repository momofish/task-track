import React, { Component } from 'react';
import PopBox from './PopBox';
import { Calendar } from 'react-date-range';

class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.select = this.select.bind(this);
  }

  select(item) {
    let onSelect = this.props.onSelect;
    if (onSelect(item) === false)
      return;
    PopBox.close();
  }

  render() {
    return (
      <Calendar date={this.props.selected} onChange={this.select} />
    )
  }
}

DatePicker.open = function open(options) {
  let {target, align} = options;
  let boxOptions = { target, align, content: <DatePicker {...options} /> };
  PopBox.open(boxOptions);
}

export default DatePicker;