import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import classnames from 'classnames';

import { Icon } from './';

class IconText extends Component {
  click(event) {
    let {onClick, to} = this.props;

    if (onClick) {
      onClick(event);
      return;
    }

    if (to) browserHistory.push(to);
  }

  render() {
    let {icon, iconClassName, tooltip, text, className, onClick, children, to} = this.props;

    return (
      <span
        className={classnames('icon-text', className, { pointer: onClick || to })}
        onClick={this.click.bind(this)}>
        {icon && <Icon icon={icon} tooltip={tooltip} className={iconClassName} />}
        {text && <span className='text'>{text}</span>}
        {children}
      </span>
    );
  }
}

export default IconText;