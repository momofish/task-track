'use strict';

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

class Overlay extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    let className = classnames(
      this.props.className,
      'overlay'
    );

    return (
      <div className={className} style={this.props.style} onClick={this.props.onClick} >
        {this.props.children}
      </div>
    );
  }
}

Overlay.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object
};

Overlay.defaultProps = {
  active: false,
  onClick: () => {}
};

export default Overlay;
