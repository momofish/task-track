import React, {Component} from 'react';
import classnames from 'classnames';
import {Icon} from '.';

class Button extends Component {
  render() {
    let {type = 'button', className, icon, text, onClick} = this.props;
    return (
      <button type={type} className={classnames('btn btn-default', className) } onClick={onClick}>
         {icon && <Icon icon={icon} />}
         {text}
      </button>
    );
  }
}

export default Button;