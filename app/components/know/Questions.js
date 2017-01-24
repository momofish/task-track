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
      pagedList: {}
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
    let {category, filter, pageNo} = params;
    let pagedList = await questionService.getQuestions(category, filter, pageNo);
    this.transPagedList(pagedList)
    this.setState({ pagedList });
  }

  transPagedList(pagedList) {
    pagedList.list = pagedList.list.map(question => ({
      data: question,
      label: question.title,
      to: `/know/q/v/${question._id}`,
      tags: question.tags.map(tag => ({ label: tag.name, style: 'info', to: `/know/q/t/${tag.name}` })),
      sub:
      <h3 className='item-sub'>
        <Link to={`/know/q/u/${question.author._id}`}>{(question.author || { name: '匿名' }).name}</Link> - {`${moment(question.answeredOn || question.createdOn).fromNow()}${question.answeredOn ? '回答' : '提问'}`}
      </h3>,
      indicators: [
        { value: question.reward || 0, label: '悬赏', className: 'info' },
        {
          value: question.answers || 0, label: question.resolved ? <i className='glyphicon glyphicon-ok' /> : '回答',
          className: question.resolved ? 'complete' : question.answers ? 'success' : 'error'
        },
        { value: question.visits || 0, label: '浏览' },
      ]
    }));
  }

  render() {
    let {pagedList} = this.state;
    let {params} = this.props;
    let {category, filter, pageNo} = params;

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 问答
          </h2>
          <Link type="button" className="btn btn-primary pull-right" to='/know/q/add'>提问</Link>
        </div>
        <PagedList className='flex-scroll' data={pagedList}
          toPage={`/know/q/${category}/${filter || 'index'}`}
          />
      </div>
    )
  }
}