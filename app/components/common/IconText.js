import React, {Component} from 'react';
import Icon from './Icon';

class IconText extends Component {
  render() {
    let {icon, iconClassName, tooltip, text, className, onClick, children} = this.props;

    return (
      <a href='javascript:'
        className={`icon-text ${className}`}
        onClick={onClick}>
        {icon && <Icon icon={icon} tooltip={tooltip} className={iconClassName} />} {text}
        {children}
      </a>
    );
  }
}

export default IconText;