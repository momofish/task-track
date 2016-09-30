import React, {Component} from 'react';
import {Button} from '.';

class GroupButton extends Component {
  render() {
    let {className, data} = this.props;
    let buttons = data;

    return (
      <div className="btn-group">
        {buttons.map((button, i) => <Button key={i} {...button} data={button} onClick={button.onClick} />) }
      </div>
    );
  }
}

export default GroupButton;