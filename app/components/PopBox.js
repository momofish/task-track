import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Overlay from './Overlay';

let containerDOM = null;

class PopBox extends Component {
  constructor (props) {
    super(props);
    this.close = this.close.bind(this);
  }
  
  close() {
  }
  
  renderBox() {
    let className = classnames(
      this.props.className,
      'popbox'
    );

    return (
      <div className={className}>
        <Overlay onClick={this.close} />
        {this.props.children}
      </div>
    );
  }

  render() {
  }
}

PopBox.propTypes = {
  className: PropTypes.string,
};

function renderContainer() {
  if (!containerDOM) {
    containerDOM = document.createElement('div');
    document.body.appendChild(containerDOM);
  }
  ReactDOM.render(<PopBox />, containerDOM);
}

export default PopBox;