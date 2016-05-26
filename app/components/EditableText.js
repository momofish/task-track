import React, {Component} from 'react';

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { isEdit: false, text: props.text };
    this.changeText = this.changeText.bind(this);
    this.saveText = this.saveText.bind(this);
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

  render() {
    let text = this.state.text;
    let isEdit = this.state.isEdit;
    return isEdit ?
      <div>
        <div className='form-group'>
          {
            this.props.multiline ?
              <textarea className='form-control' onChange={this.changeText} value={text} /> :
              <input type='text' className='form-control' onChange={this.changeText} value={text}/>
          }
        </div>
        <button type='button' className='btn btn-primary btn-sm' onClick={this.saveText}>保存</button>
        <button type='button' className='btn btn-link btn-sm' onClick={() => this.setState({ isEdit: false }) }>取消</button>
      </div> :
      <span className={this.props.className} onClick={() => this.setState({ isEdit: true }) }>{text || this.props.placeHolder}</span>
  }
}

export default EditableText;