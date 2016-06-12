import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Overlay from './Overlay';

let options = null;
let containerDOM = null;

class PopBoxContainer extends Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
  }

  close() {
    options = null;
    renderContainer();
  }

  render() {
    let active = options != null;

    let className = classnames(
      this.props.className,
      'popbox-container',
      { active }
    );

    if (options) {
      let rect = options.target.getClientRects()[0];
      let style = options.style = options.style || {};
      style.top = rect.bottom + 5;
      if (options.align == 'right')
        style.right = document.documentElement.scrollWidth - rect.right;
      else
        style.left = rect.left;
    }

    return (
      <div className={className}>
        <Overlay onClick={this.close} />
        {options && <PopBox {...options} />}
      </div>
    );
  }
}

class PopBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let options = this.props;
    let className = classnames(
      options.className,
      'popbox'
    );

    return (
      <div className={className} style={options.style}>
        {this.props.children || options.content}
      </div>
    );
  }
}

PopBox.propTypes = {
  className: PropTypes.string,
};

function renderContainer() {
  ReactDOM.render(<PopBoxContainer />, containerDOM);
}

PopBox.open = function open(boxOptions) {
  if (!containerDOM) {
    containerDOM = document.createElement('div');
    document.body.appendChild(containerDOM);
  }
  options = boxOptions;
  renderContainer();
}

PopBox.close = function close() {
  options = null;
  renderContainer();
}

export default PopBox;