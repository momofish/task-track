import React, { Component } from 'react';

import { IconText, Button, EditorMd } from '.';
import { shared } from '../../utils'

export default class Article extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  submit() {
    let {onSubmit} = this.props;
    if (onSubmit instanceof Function) {
      onSubmit(this.editor.text.value);
    }
    this.setState({ mode: undefined });
  }

  render() {
    let {editable, content, col, options} = this.props;
    let {mode = this.props.mode} = this.state;

    return (
      <article>
        {col && <div className='article-viewer-column'>{col}</div>}
        <div className='flex flex-verticle'>
          {mode == 'edit' ?
            <EditorMd value={content} ref={editor => this.editor = editor} /> :
            <div className='markdown-body content' dangerouslySetInnerHTML={{ __html: shared.md.render(content || '') }} ></div>}
          {options && <ul className='options'>
            {options.map((option, i) => <li key={i}>{option}</li>)}
            {editable && (mode != 'edit' ?
              <IconText onClick={() => { this.setState({ mode: 'edit' }) }}>编辑</IconText> :
              <span>
                <Button className='btn-primary btn-xs' onClick={this.submit.bind(this)}>保存</Button>
                <Button className='btn-link btn-xs' onClick={() => { this.setState({ mode: undefined }) }}>取消</Button>
              </span>)}
          </ul>}
        </div>
      </article>
    );
  }
}