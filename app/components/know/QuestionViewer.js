import React, { Component } from 'react';
import { Link } from 'react-router';
import { assign } from 'lodash';
import moment from 'moment';

import AuthorLink from './AuthorLink';
import { IconText, Article, VoteWidget, EditorMd } from '../common';
import { questionService, userService } from '../../services'

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  isOwner(author) {
    let {currentUser} = userService;
    return author && currentUser && author._id == currentUser._id;
  }

  async componentDidMount() {
    let {params} = this.props;
    await this.loadData(params.id);
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
    let answerText = this.editor.text;
    let answerContent = answerText.value;

    if (!answerContent) {
      toastr.error(`请输入内容`);
      return;
    }

    await questionService.saveAnswer(params.id, { content: answerContent });
    answerText.value = '';
    this.loadData(params.id);
  }

  render() {
    let {question} = this.state;
    if (!question)
      return <div />;

    let {title, content, tags, answers, voteNum} = question;
    let {currentUser} = userService;

    return (
      <div className='container-fluid article-viewer flex-scroll'>
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
                {` ${question.visitNum || 0} 浏览 `}
                {this.isOwner(question.author) && <Link to={`/know/q/e/${question._id}`}>编辑</Link>}
              </span>
            </li>
          </ul>}
        </div>
        <Article
          col={<VoteWidget voteNum={voteNum} voteUri={`/api/questions/${question._id}/votes`} />}
          content={content}
          options={[
            `${moment(question.createdOn).fromNow()}提问`
          ]}
          enableReply={true} replies={question.replies} onReply={async (content) => {
            let reply = await questionService.saveChild(question._id, 'replies', { content: content.value });
            question.replies.push(reply);
            this.forceUpdate();
          }}
        />
        <div className='replies'>
          <h4>{answers.length}个回答</h4>
          {answers.map((answer, i) => <Article key={i}
            col={<VoteWidget
              voteUri={`/api/questions/${question._id}/answers/${answer._id}/votes`}
              voteNum={answer.voteNum}
              accept={this.isOwner(question.author) && {
                accepted: answer.accepted,
                onAccept: async () => {
                  await questionService.saveAnswer(question._id, assign(answer, { accepted: !answer.accepted }));
                  this.forceUpdate();
                }
              }}
            />}
            content={answer.content}
            editable={this.isOwner(answer.author)}
            onSubmit={async (content) => {
              await questionService.saveAnswer(question._id, assign(answer, { content: content }));
              this.forceUpdate();
            }}
            options={[
              <AuthorLink author={answer.author} />,
              ` - ${moment(answer.createdOn).fromNow()}回答`
            ]}
            enableReply={true} replies={answer.replies} onReply={async (content) => {
              let reply = await questionService.saveChild(question._id, `answers/${answer._id}/replies`, { content: content.value });
              answer.replies.push(reply);
              this.forceUpdate();
            }}
          />)}
        </div>
        <article>
          <div className='article-viewer-column'></div>
          {!answers.some(answer => answer.author._id == currentUser._id) ?
            <form className='add-reply' onSubmit={this.saveAnswer.bind(this)}>
              <h4>我要回答</h4>
              <EditorMd ref={editor => this.editor = editor} lazy />
              <button className='btn btn-primary' type='submit'>提交</button>
            </form> :
            <div className='add-answer'>
              <p>此问题您已回答</p>
            </div>}
        </article>
      </div>
    );
  }
}