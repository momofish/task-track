import React, { Component, PropTypes, DOM } from 'react';
import classnames from 'classnames';
import Overlay from './Overlay';

let box = null;
let containerDOM = null;

class PopBoxContainer extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }
  
  close() {
    box = null;
    renderContainer();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    let active = box != null;

    let className = classnames(
      this.props.className,
      'popbox-container',
      {active}
    );
    
    let position;
    if (box) {
      let $trigger = $(box.trigger);
      let offset = $trigger.offset();
      let height = $trigger.height();
      position = {left: offset.left, top: offset.top + height + 5};
    }

    return (
      <div className={className} style={position && position}>
        <Overlay onClick={this.close} />
        {box && <PopBox {...box} />}
      </div>
    );
  }
}

class PopBox extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    let className = classnames(
      this.props.className,
      'popbox'
    );
    
    return (
      <div className={className}>
        {this.props.children}
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

PopBox.open = function open(options) {
  if (!containerDOM) {
    containerDOM = document.createElement('div');
    document.body.appendChild(containerDOM);
  }
  box = options;
  renderContainer();
}

export default PopBox;