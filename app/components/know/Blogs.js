import React, { Component } from 'React';
import { Link } from 'react-router';
import moment from 'moment';

import { PagedList } from '../common';
import { blogService } from '../../services'

const listLeadConfig = {
  latest: { title: '最新头条' },
  hot: { title: '热门头条' },
  unanswered: { title: '未回答头条' },
  t: {
    title: t => `头条 - ${t.name}`,
    lead: t =>
      <div className='well well-sm'>
        <h4>{t.name}</h4>
        <p>{t.description || '暂无简介'}</p>
      </div>
  },
  u: {
    title: t => `${t.name}的发布`,
    lead: t =>
      <div className='well well-sm'>
        <h4>{t.name}</h4>
        <p>{t.description || '暂无简介'}</p>
      </div>
  },
}

export default class extends Component {
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
    let pagedList = await blogService.getBlogs(category, filter, pageNo);
    this.transPagedList(pagedList)
    this.setState({ pagedList });
  }

  transPagedList(pagedList) {
    pagedList.list = pagedList.list.map(blogService.mapItem);
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
            <i className='glyphicon glyphicon-list' /> {title || '头条'}
          </h2>
          <Link type="button" className="btn btn-primary pull-right" to='/know/b/add'>撰写</Link>
        </div>
        {lead && lead(head)}
        <PagedList className='flex-scroll' data={pagedList}
          toPage={`/know/b/${category}/${encodeURIComponent(filter || 'index')}`}
        />
      </div>
    )
  }
}