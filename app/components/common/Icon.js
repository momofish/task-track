import React, {Component} from 'react';

class Icon extends Component {
  render() {
    let {icon, tooltip, onClick, className} = this.props;
    return (
      <i className={`glyphicon glyphicon-${icon} ${className}`}
         data-toggle='tooltip' title={tooltip} onClick={onClick} />
    );
  }
}

export default Icon;