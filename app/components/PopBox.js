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

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    let active = options != null;

    let className = classnames(
      this.props.className,
      'popbox-container',
      {active}
    );
    
    let position;
    if (options) {
      let $trigger = $(options.trigger);
      let offset = $trigger.offset();
      let height = $trigger.height();
      position = {left: offset.left, top: offset.top + height + 5};
    }

    return (
      <div className={className} style={position && position}>
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

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    let options = this.props;
    let className = classnames(
      options.className,
      'popbox'
    );
    
    return (
      <div className={className}>
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