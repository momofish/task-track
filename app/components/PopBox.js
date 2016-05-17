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

  render () {
    return (
      <div className={className}>
        <Overlay onClick={this.close} />
        <div>box</div>
      </div>
    );
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