import React, { Component } from 'react';
import classnames from 'classnames';
import { Icon } from '.';

class Button extends Component {
  render() {
    let {type = 'button', className, icon, text, onClick, children} = this.props;
    return (
      <button onClick={onClick} type={type} className={classnames('btn btn-default', className)}>
        {icon && <Icon icon={icon} />}
        {text}
        {children}
      </button>
    );
  }
}

export default Button;