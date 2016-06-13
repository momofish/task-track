import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

let options = null;
let containerDOM = null;

class ModalContainer extends Component {
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
  componentDidMount() {
    $(this.refs.modal).modal('show')
      .on('hidden.bs.modal', () => {
        let onHidden = this.props.onHidden;
        let result = onHidden && onHidden();
        if (result === false)
          return;
        Modal.close();
      });
  }

  componentWillUnmount() {
    $(this.refs.modal).modal('hide');
  }

  render() {
    let realOptions = options || {};
    let content = this.props.children || realOptions.content;
    let {header, body, footer} = this.props;

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
            {footer && <div className='modal-footer'>
              {footer}
            </div>}
            {content}
          </div>
        </div>
      </div>
    );
  }
}

function renderContainer() {
  if (!containerDOM) {
    containerDOM = document.createElement('div');
    document.body.appendChild(containerDOM);
  }
  ReactDOM.render(<ModalContainer />, containerDOM);
}

Modal.open = function open(modalOptions) {
  options = modalOptions;
  renderContainer();
}

Modal.close = function close() {
  options = null;
  renderContainer();
}

export default Modal;