import React, { Component } from 'react';
import { Link } from 'react-router';
import { assign } from 'lodash';
import moment from 'moment';
import Markdown from 'markdown-it'
import highlight from 'highlight.js'

import AuthorLink from './AuthorLink';
import { IconText, Article, VoteWidget } from '../common';
import { blogService, userService } from '../../services'

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.md = new Markdown({
      highlight: (str, lang) => {
        if (lang && highlight.getLanguage(lang)) {
          try {
            return highlight.highlight(lang, str).value;
          } catch (__) { }
        }

        return '';
      }
    });
  }

  isOwner(author) {
    let {currentUser} = userService;
    return author && currentUser && author._id == currentUser._id;
  }

  componentDidMount() {
    let {params} = this.props;
    this.loadData(params.id)
  }

  componentWillReceiveProps(nextProps) {
    let {params} = nextProps;
    this.loadData(params.id)
  }

  async loadData(id) {
    let blog = await blogService.getBlog(id);
    this.setState({ blog });
  }

  async saveComment(event) {
    event.preventDefault();

    let {params} = this.props;
    let commentContent = this._commentText.value;

    if (!commentContent) {
      toastr.error(`请输入内容`);
      return;
    }

    await blogService.saveComment(params.id, { content: commentContent });
    this._commentText.value = '';
    this.loadData(params.id);
  }

  render() {
    let {blog} = this.state;
    if (!blog)
      return <div />;

    let {title, content, tags, comments, voteNum} = blog;
    let {currentUser} = userService;

    return (
      <div className='container-fluid flex flex-verticle article-viewer flex-scroll'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-align-justify' /> {title}
          </h2>
          {tags && <ul className='item-tags'>
            {tags.map((tag, k) => (
              <li key={k} className={`tag`} title={tag.name}>
                <IconText text={tag.name} to={`/know/b/t/${tag.name}`} />
              </li>
            ))}
            <li>
              <span>
                {blog.author && <AuthorLink author={blog.author} />}
                {` - ${moment(blog.commentedOn || blog.createdOn).fromNow()}${blog.commentedOn ? '回答' : '提问'}`}
                {` 浏览${blog.visitNum || 0}`}
              </span>
            </li>
          </ul>}
        </div>
        <Article
          col={<VoteWidget voteNum={voteNum} voteUri={`/api/blogs/${blog._id}/votes`} />}
          content={this.md.render(content || '无内容')}
          options={[
            `${moment(blog.createdOn).fromNow()}提问`
          ]}
        />
        <div className='replies'>
          <h4>{comments.length}个评论</h4>
          {comments.map((comment, i) => <Article key={i}
            col={<VoteWidget voteNum={comment.voteNum} voteUri={`/api/blogs/${blog._id}/comments/${comment._id}/votes`} />}
            content={this.md.render(comment.content || '无内容')}
            options={[
              <AuthorLink author={comment.author} />,
              ` - ${moment(comment.createdOn).fromNow()}评论`
            ]}
          />)}
        </div>
        <article>
          <div className='article-viewer-column'></div>
          <form className='add-reply' onSubmit={this.saveComment.bind(this)}>
            <h4>我要评论</h4>
            <div className='form-group'>
              <textarea ref={text => this._commentText = text} rows='10' className='form-control' />
            </div>
            <button className='btn btn-primary' type='submit'>提交</button>
          </form>
        </article>
      </div>
    );
  }
}