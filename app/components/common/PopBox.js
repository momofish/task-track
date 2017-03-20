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
      let rect = options.target.getBoundingClientRect();
      let style = options.style = options.style || {};
      let { clientWidth, clientHeight } = document.documentElement
      // 底部不够空间，则向上弹出
      if (clientHeight - rect.bottom < 200)
        style.bottom = (clientHeight - rect.top) + 5;
      else
        style.top = rect.bottom + 5;
      // 右部不够空间或强制靠右，则靠右对齐
      if (options.align == 'right' || clientWidth - rect.right < 200)
        style.right = clientWidth - rect.right;
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

  static open(boxOptions) {
    if (!containerDOM) {
      containerDOM = document.createElement('div');
      document.body.appendChild(containerDOM);
    }
    options = boxOptions;
    renderContainer();
  }

  static close() {
    options.onClose && options.onClose();
    options = null;
    renderContainer();
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

function renderContainer() {
  ReactDOM.render(<PopBoxContainer />, containerDOM);
}

export default PopBox;