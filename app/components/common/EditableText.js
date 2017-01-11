import React, { Component } from 'react';
import Markdown from 'markdown-it'

import { Icon } from '.';

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
    onChange && onChange({ value: this.state.value });
    this.setState({ isEdit: false });
  }

  submit(event) {
    event.preventDefault();
    this.save();
  }

  keyDown(event) {
    if (event.keyCode == 13) {
      this.submit(event);
    }
  }

  render() {
    let {multiline, placeholder, className, editClassName, style, actionIcon, onAction} = this.props;
    let {value, isEdit} = this.state;

    return isEdit ?
      <div onSubmit={this.submit.bind(this)} className={editClassName} style={style}>
        <div className='form-group'>
          {
            multiline ?
              <textarea className='form-control'
                onChange={this.change.bind(this)} rows='5'
                value={value} placeholder={placeholder} /> :
              <input type='value' className='form-control'
                onChange={this.change.bind(this)}
                onKeyDown={this.keyDown.bind(this)}
                value={value} placeholder={placeholder} />
          }
        </div>
        <button type='button' className='btn btn-info btn-sm'
          onClick={this.save.bind(this)}>
          确定
        </button>
        <button type='button' className='btn btn-link btn-sm'
          onClick={() => this.setState({ isEdit: false })}>
          取消
        </button>
      </div> :
      <a href='javascript:' className={`form-control-static ${className}`} style={style}
        onClick={() => this.setState({ isEdit: true })} >
        <div dangerouslySetInnerHTML={{
          __html: (multiline && value ? this.md.render(value) : value) || placeholder
        }} />
        {actionIcon && <Icon icon={actionIcon} onClick={event => {
          onAction && onAction(event);
          event.stopPropagation();
        } } className='action-icon' />}
      </a>
  }
}

export default EditableText;