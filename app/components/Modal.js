import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

let options = null;
let containerDOM = null;

class ModalContainer extends Component {
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
      'modal-container',
      { active }
    );

    return (
      <div className={className}>
        {options && <Modal onHidden={() => Modal.close() } {...options} />}
      </div>
    );
  }
}

class Modal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(this.refs.modal).modal('show')
      .on('hidden.bs.modal', () => {
        let onHidden = this.props.onHidden;
        onHidden && onHidden();
      });
  }

  componentWillUnmount() {
    $(this.refs.modal).modal('hide');
  }

  render() {
    let realOptions = options || {};
    let content = this.props.children || realOptions.content;
    let header = this.props.header || realOptions.header;
    let body = this.props.body || realOptions.body;

    return (
      <div ref='modal' className='modal fade'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            {header && <div className="modal-header">
              <button type='button' className='close' data-dismiss='modal'>
                <span aria-hidden='true'>×</span>
                <span className='sr-only'>Close</span>
              </button>
              {header}
            </div>}
            {body && <div className='modal-body'>
              {body}
            </div>}
            {content}
          </div>
        </div>
      </div>
    );
  }
}

function renderContainer() {
  ReactDOM.render(<ModalContainer />, containerDOM);
}

Modal.open = function open(modalOptions) {
  if (!containerDOM) {
    containerDOM = document.createElement('div');
    document.body.appendChild(containerDOM);
  }
  options = modalOptions;
  renderContainer();
}

Modal.close = function close() {
  options = null;
  renderContainer();
}

export default Modal;