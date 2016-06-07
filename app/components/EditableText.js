import React, {Component} from 'react';

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { isEdit: false, text: props.text };
    this.changeText = this.changeText.bind(this);
    this.saveText = this.saveText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    this.state.text = nextProps.text;
  }

  changeText(event) {
    this.setState({ text: event.target.value });
  }

  saveText(event) {
    let onChange = this.props.onChange;
    onChange && onChange(this.state.text);
    this.setState({ isEdit: false });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.saveText();
  }

  render() {
    let text = this.state.text;
    let isEdit = this.state.isEdit;
    return isEdit ?
      <form onSubmit={this.handleSubmit}>
        <div className='form-group'>
          {
            this.props.multiline ?
              <textarea className='form-control' onChange={this.changeText} value={text} placeholder={this.props.placeholder} /> :
              <input type='text' className='form-control' onChange={this.changeText} value={text} placeholder={this.props.placeholder} />
          }
        </div>
        <button type='button' className='btn btn-primary btn-sm' onClick={this.saveText}>保存</button>
        <button type='button' className='btn btn-link btn-sm' onClick={() => this.setState({ isEdit: false }) }>取消</button>
      </form> :
      <a href='javascript:' className={this.props.className} onClick={() => this.setState({ isEdit: true }) }>{text || this.props.placeholder}</a>
  }
}

export default EditableText;