import React, {Component} from 'react';
import Markdown from 'markdown-it'

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { isEdit: false, value: props.value };

    this.md = new Markdown();
  }

  componentWillReceiveProps(nextProps) {
    this.state.value = nextProps.value;
  }

  change(event) {
    this.setState({ value: event.target.value });
  }

  save() {
    let onChange = this.props.onChange;
    onChange && onChange({value: this.state.value});
    this.setState({ isEdit: false });
  }

  submit(event) {
    event.preventDefault();
    this.save();
  }

  keyDown(event) {
    if(event.keyCode == 13) {
      this.submit(event);
    }
  }

  render() {
    let multiline = this.props.multiline;
    let value = this.state.value;
    let isEdit = this.state.isEdit;
    return isEdit ?
      <div onSubmit={this.submit.bind(this)}>
        <div className='form-group'>
          {
            multiline ?
              <textarea className='form-control'
                onChange={this.change.bind(this)} rows='5'
                value={value} placeholder={this.props.placeholder} /> :
              <input type='value' className='form-control'
                onChange={this.change.bind(this)}
                onKeyDown={this.keyDown.bind(this)}
                value={value} placeholder={this.props.placeholder} />
          }
        </div>
        <button type='button' className='btn btn-info btn-sm'
          onClick={this.save.bind(this)}>
          确定
        </button>
        <button type='button' className='btn btn-link btn-sm'
          onClick={() => this.setState({ isEdit: false }) }>
          取消
        </button>
      </div> :
      <a href='javascript:' className={`${this.props.className} form-control-static`}
        onClick={() => this.setState({ isEdit: true }) }
        dangerouslySetInnerHTML={{
          __html: (multiline && value ? this.md.render(value) : value) || this.props.placeholder
        }}>
      </a>
  }
}

export default EditableText;