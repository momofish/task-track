import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Markdown from 'markdown-it'
import highlight from 'highlight.js'

import { IconText, Article, VoteWidget } from '../common';
import { questionService } from '../../services'

export default class QuestionViewer extends Component {
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

  componentDidMount() {
    let {params} = this.props;
    this.loadData(params.id)
  }

  componentWillReceiveProps(nextProps) {
    let {params} = nextProps;
    this.loadData(params.id)
  }

  async loadData(id) {
    let question = await questionService.getQuestion(id);
    this.setState({ question });
  }

  async addComment(event) {
    event.preventDefault();

    let {params} = this.props;
    let commentContent = this._commentText.value;

    if (!commentContent) {
      alert(`请输入内容`);
      return;
    }

    await questionService.addComment(params.id, { content: commentContent });
    this._commentText.value = '';
    this.loadData(params.id);
  }

  render() {

    let {question} = this.state;
    if (!question)
      return <div />;

    let {title, content, tags, comments, votes} = question;

    return (
      <div className='container-fluid flex flex-verticle article-viewer flex-scroll'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-align-justify' /> {title}
          </h2>
          {tags && <ul className='item-tags'>
            {tags.map((tag, k) => (
              <li key={k} className={`tag tag-${tag.style}`} title={tag.name}>
                <IconText text={tag.name} to={`/know/q/t/${tag.name}`} />
              </li>
            ))}
            <li>
              <span>
                {question.author && <Link to={`/know/q/u/${question.author._id}`}>{(question.author || { name: '匿名' }).name}</Link>}
                {` - ${moment(question.answeredOn || question.createdOn).fromNow()}${question.answeredOn ? '回答' : '提问'}`}
              </span>
            </li>
          </ul>}
        </div>
        <Article
          col={<VoteWidget votes={votes} />}
          content={this.md.render(content || '无内容')}
          options={[
            `${moment(question.createdOn).fromNow()}提问`
          ]}
          />
        <div className='comments'>
          <h4>{comments.length}个回答</h4>
          {comments.map((comment, i) => <Article key={i}
            content={this.md.render(comment.content || '无内容')}
            col={<VoteWidget votes={votes} />}
            options={[
              <Link to={`/know/q/u/${comment.author._id}`}>{(comment.author || { name: '匿名' }).name}</Link>,
              `${moment(comment.createdOn).fromNow()}回答`
            ]}
            />)}
        </div>
        <article>
          <div className='article-viewer-column'></div>
          <form className='add-comment' onSubmit={this.addComment.bind(this)}>
            <h4>我要回答</h4>
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