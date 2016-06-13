import React, {Component} from 'react';

class SelectableText extends Component {
  render() {
    let {icon, text, className, onClick} = this.props;

    return (
      <a href='javascript:'
        className={`selectable-text ${className}`}
        onClick={onClick}>
        {icon && <i className={`glyphicon glyphicon-${icon}`} />} {text}
      </a>
    );
  }
}

export default SelectableText;