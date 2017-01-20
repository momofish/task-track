import React, { Component } from 'React';
import { Link } from 'react-router';
import moment from 'moment';

import { PagedList } from '../common';
import { questionService } from '../../services'

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: { code: null, name: '分类' }, tags: [],
      questions: {}
    };
  }

  async componentDidMount() {
    let {params} = this.props;
    this.getData(params);
  }

  componentWillReceiveProps(nextProps) {
    let {params} = nextProps;
    this.getData(params);
  }

  async getData(params) {
    let {category} = params;
    let questions = await questionService.getQuestions(category);
    this.setState({ questions: this.map2PagedList(questions) });
  }

  map2PagedList(questions) {
    return {
      list: questions.map(question => ({
        label: question.title,
        tags: question.tags.map(tag => ({ label: tag.name, style: 'info' })),
        sub:
        <h3 className='item-sub'>
          <Link to=''>{(question.author || { name: '匿名' }).name}</Link> - <Link to=''>{`${moment(question.answeredOn || question.createdOn).fromNow()}${question.answeredOn ? '回答' : '提问'}`}</Link>
        </h3>,
        indicators: [
          { value: question.reward || 0, label: '悬赏', className: 'info' },
          {
            value: question.answers || 0, label: question.resolved ? <i className='glyphicon glyphicon-ok' /> : '回答',
            className: question.resolved ? 'complete' : question.answers ? 'success' : 'error'
          },
          { value: question.visits || 0, label: '浏览' },
        ]
      }))
    };
  }

  render() {
    let {questions} = this.state;

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 问答
          </h2>
          <Link type="button" className="btn btn-primary pull-right" to='/know/q/add'>提问</Link>
        </div>
        <PagedList data={questions}></PagedList>
      </div>
    )
  }
}