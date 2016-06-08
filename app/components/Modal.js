import React, {Component} from 'react';

class Modal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(this.refs.modal).on('hidden.bs.modal', () => {
      this.hide();
    });
  }

  componentWillUnmount() {
    $(this.refs.modal).modal('hide');
  }

  componentWillReceiveProps(nextProps) {
    $(this.refs.modal).modal('show');
  }
  
  hide() {
    let onHidden = this.props.onHidden;
    onHidden && onHidden();
  }

  render() {
    return (
      <div ref='modal' className='modal'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;