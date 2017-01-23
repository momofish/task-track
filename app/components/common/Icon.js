import React, { Component } from 'react';
import classnames from 'classnames';

class Icon extends Component {
  render() {
    let {icon, tooltip, onClick, className} = this.props;

    return (
      <i className={classnames(`glyphicon glyphicon-${icon}`, className)}
        data-toggle='tooltip' title={tooltip} onClick={onClick} />
    );
  }
}

export default Icon;