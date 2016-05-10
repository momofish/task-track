import React from 'react';

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var that = this;
    $(this.refs.modal).modal().on('hidden.bs.modal', function (e) {
      that.handleHidden();
    });
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    $(this.refs.modal).modal('show');
  }
  
  handleHidden() {
    var onHidden = this.props.onHidden;
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