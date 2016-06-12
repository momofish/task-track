import React, {Component} from 'react';
import Markdown from 'markdown-it'

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { isEdit: false, text: props.text };
    this.changeText = this.changeText.bind(this);
    this.saveText = this.saveText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.md = new Markdown();
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
    let multiline = this.props.multiline;
    let text = this.state.text;
    let isEdit = this.state.isEdit;
    return isEdit ?
      <form onSubmit={this.handleSubmit}>
        <div className='form-group'>
          {
            multiline ?
              <textarea className='form-control' onChange={this.changeText} value={text} placeholder={this.props.placeholder} /> :
              <input type='text' className='form-control' onChange={this.changeText} value={text} placeholder={this.props.placeholder} />
          }
        </div>
        <button type='button' className='btn btn-primary btn-sm' onClick={this.saveText}>保存</button>
        <button type='button' className='btn btn-link btn-sm' onClick={() => this.setState({ isEdit: false }) }>取消</button>
      </form> :
      <a href='javascript:' className={`{this.props.className} form-control-static`}
        onClick={() => this.setState({ isEdit: true }) }
        dangerouslySetInnerHTML={{ __html: (multiline && text ? this.md.render(text) : text) || this.props.placeholder }}>
      </a>
  }
}

export default EditableText;