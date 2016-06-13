import React, {Component} from 'react';

class Icon extends Component {
  render() {
    let {icon, onClick, className} = this.props;
    return (
      <i className={`glyphicon glyphicon-${icon} ${className}`}
        onClick={onClick} />
    );
  }
}

export default Icon;