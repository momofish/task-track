import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import Icon from './Icon';

class IconText extends Component {
  click(event) {
    let {onClick, to, history} = this.props;

    if (onClick) {
      onClick(event);
      return;
    }

    //if (to) history.pushState(null, to);
  }

  render() {
    let {icon, iconClassName, tooltip, text, className, onClick, children, to} = this.props;

    return (
      <a href='javascript:'
        className={classnames('icon-text', className)}
        onClick={this.click.bind(this)}>
        {icon && <Icon icon={icon} tooltip={tooltip} className={iconClassName} />}
        {text}
        {children}
      </a>
    );
  }
}

export default IconText;