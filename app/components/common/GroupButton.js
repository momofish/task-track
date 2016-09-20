import React, {Component} from 'react';
import {Button} from '.';

class GroupButton extends Component {
  render() {
    let {className, data, onClick} = this.props;
    let buttons = data;

    return (
      <div className="btn-group">
        {buttons.map((button, i) => <Button key={i} {...button} data={button} onClick={() => onClick && onClick(button)} />) }
      </div>
    );
  }
}

export default GroupButton;