import React, { Component } from 'React';
import { Link } from 'react-router';
import moment from 'moment';

import { PagedList } from '../common';
import { questionService } from '../../services'

const listLeadConfig = {
  latest: { title: '最新问答' },
  hot: { title: '热门问答' },
  unanswered: { title: '未回答问答' },
  t: {
    title: t => `问答 - ${t.name}`,
    lead: t =>
      <div className='well well-sm'>
        <h4>{t.name}</h4>
        <p>{t.description || '暂无简介'}</p>
      </div>
  },
  u: {
    title: t => `${t.name}的提问`,
    lead: t =>
      <div className='well well-sm'>
        <h4>{t.name}</h4>
        <p>{t.description || '暂无简介'}</p>
      </div>
  },
}

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
    pagedList.list = pagedList.list.map(questionService.mapItem);
  }

  render() {
    let {pagedList} = this.state;
    let {head = {}} = pagedList;
    let {params} = this.props;
    let {category, filter, pageNo} = params;
    let leadConfig = listLeadConfig[category] || {};
    let {title, lead} = leadConfig;
    if (title instanceof Function) title = title(head);

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-list' /> {title || '问答'}
          </h2>
          <Link type="button" className="btn btn-primary pull-right" to='/know/q/add'>提问</Link>
        </div>
        {lead && lead(head)}
        <PagedList className='flex-scroll' data={pagedList}
          toPage={`/know/q/${category}/${encodeURIComponent(filter || 'index')}`}
        />
      </div>
    )
  }
}