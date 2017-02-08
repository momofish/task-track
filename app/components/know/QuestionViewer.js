import React, { Component } from 'react';
import { Link } from 'react-router';
import { assign } from 'lodash';
import moment from 'moment';
import Markdown from 'markdown-it'
import highlight from 'highlight.js'

import AuthorLink from './AuthorLink';
import { IconText, Article, VoteWidget } from '../common';
import { questionService, userService } from '../../services'

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
    let question = await questionService.getQuestion(id);
    this.setState({ question });
  }

  async saveAnswer(event) {
    event.preventDefault();

    let {params} = this.props;
    let answerContent = this._answerText.value;

    if (!answerContent) {
      toastr.error(`请输入内容`);
      return;
    }

    await questionService.saveAnswer(params.id, { content: answerContent });
    this._answerText.value = '';
    this.loadData(params.id);
  }

  render() {

    let {question} = this.state;
    if (!question)
      return <div />;

    let {title, content, tags, answers, votes} = question;
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
                <IconText text={tag.name} to={`/know/q/t/${tag.name}`} />
              </li>
            ))}
            <li>
              <span>
                {question.author && <AuthorLink author={question.author} />}
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
        <div className='answers'>
          <h4>{answers.length}个回答</h4>
          {answers.map((answer, i) => <Article key={i}
            col={<VoteWidget
              votes={votes}
              accept={this.isOwner(answer.author) && {
                accepted: answer.accepted,
                onAccept: () => {
                  questionService.saveAnswer(question._id, assign(answer, { accepted: !answer.accepted }));
                  this.forceUpdate();
                }
              }} />
            }
            content={this.md.render(answer.content || '无内容')}
            options={[
              <AuthorLink author={answer.author} />,
              ` - ${moment(answer.createdOn).fromNow()}回答`
            ]}
          />)}
        </div>
        <article>
          <div className='article-viewer-column'></div>
          {!answers.some(answer => answer.author._id == currentUser._id) ?
            <form className='add-answer' onSubmit={this.saveAnswer.bind(this)}>
              <h4>我要回答</h4>
              <div className='form-group'>
                <textarea ref={text => this._answerText = text} rows='10' className='form-control' />
              </div>
              <button className='btn btn-primary' type='submit'>提交</button>
            </form> :
            <div className='add-answer'>
              <h4>此问题您已回答</h4>
            </div>}
        </article>
      </div>
    );
  }
}