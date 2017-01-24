import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Markdown from 'markdown-it'

import { IconText } from '../common';
import { questionService } from '../../services'

export default class QuestionViewer extends Component {
  constructor(props) {
    super(props);

    this.md = new Markdown();
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
  }

  render() {
    if (!this.state)
      return <div />;

    let {question} = this.state;
    let {title, content, tags, comments} = question;

    return (
      <div className='container-fluid flex flex-verticle article'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> {title}
          </h2>
          {tags && <ul className='item-tags'>
            {tags.map((tag, k) => (
              <li key={k} className={`tag tag-${tag.style}`} title={tag.name}
                onClick={event => onClickTag && onClickTag(item, tag, event)}>
                <IconText text={tag.name} to={`/know/q/t/${tag.name}`} />
              </li>
            ))}
          </ul>}
          <span className=''>
            {question.author && <Link to={`/know/q/u/${question.author._id}`}>{(question.author || { name: '匿名' }).name}</Link>}
            {` - ${moment(question.answeredOn || question.createdOn).fromNow()}${question.answeredOn ? '回答' : '提问'}`}
          </span>
        </div>
        <div className='flex-scroll'>
          <div dangerouslySetInnerHTML={{
            __html: this.md.render(content)
          }} />
          <div className='comments'>
            <h3>评论</h3>
            <ul>
              {comments.length ? comments.map((comment, i) =>
                <li key={i}>
                  <h5>{comment.author.name}<span className='pull-right'>{moment(comment.createdOn).format('MM-DD hh:mm')} #{i + 1}</span></h5>
                  <span dangerouslySetInnerHTML={{ __html: this.md.render(comment.content || '') }}></span>
                </li>
              ) :
                <li>暂无评论，快来坐沙发吧</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}