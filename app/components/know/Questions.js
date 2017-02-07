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
    pagedList.list = pagedList.list.map(questionService.mapItem);
  }

  render() {
    let {pagedList} = this.state;
    let {params} = this.props;
    let {category, filter, pageNo} = params;

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-list' /> 问答
          </h2>
          <Link type="button" className="btn btn-primary pull-right" to='/know/q/add'>提问</Link>
        </div>
        <PagedList className='flex-scroll' data={pagedList}
          toPage={`/know/q/${category}/${encodeURIComponent(filter || 'index')}`}
        />
      </div>
    )
  }
}