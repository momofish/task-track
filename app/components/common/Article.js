import React, { Component } from 'react';
import moment from 'moment';

import { IconText, Button, EditorMd, PagedList, EditableText } from '.';
import { AuthorLink } from '../know';
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

  mapReply(reply) {
    return {
      content: <span>
        {reply.content} {reply.author && <AuthorLink author={reply.author} />}
        {` - ${moment(reply.createdOn).fromNow()}回复`}
      </span>,
    }
  }

  render() {
    let {editable, content, col, options, enableReply, replies = [], onReply} = this.props;
    let {mode = this.props.mode, repling} = this.state;

    return (
      <article>
        {col && <div className='article-viewer-column'>{col}</div>}
        <div className='flex flex-verticle'>
          {mode == 'edit' ?
            <EditorMd value={content} ref={editor => this.editor = editor} /> :
            <div className='markdown-body content' dangerouslySetInnerHTML={{ __html: shared.md.render(content || '') }} ></div>}
          {options && <ul className='options'>
            {options.map((option, i) => <li key={i}>{option}</li>)}
            {enableReply && <IconText>{`${replies.length} 评论`}</IconText>}
            {editable && (mode != 'edit' ?
              <IconText onClick={() => { this.setState({ mode: 'edit' }) }}>编辑</IconText> :
              <span>
                <Button className='btn-primary btn-xs' onClick={this.submit.bind(this)}>保存</Button>
                <Button className='btn-link btn-xs' onClick={() => { this.setState({ mode: undefined }) }}>取消</Button>
              </span>)}
          </ul>}
          {enableReply && <PagedList data={{ list: replies.map(this.mapReply) }}>
            {repling ?
              <EditableText isEdit={true} value='' placeholder='这里输入评论内容'
                onSubmit={async (value) => {
                  await onReply && onReply(value);
                  this.setState({ repling: false });
                }}
                onCancel={() => this.setState({ repling: false })}
              /> :
              <IconText onClick={() => this.setState({ repling: true })}>我要评论</IconText>}
          </PagedList>}
        </div>
      </article>
    );
  }
}