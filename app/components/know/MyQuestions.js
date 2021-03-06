import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import classnames from 'classnames';

import { PagedList, Button } from '../common';
import { questionService } from '../../services'

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    let {filter, pageNo} = params;
    let pagedList = await questionService.getQuestions('my', filter, pageNo);
    this.transPagedList(pagedList)
    this.setState({ pagedList });
  }

  transPagedList(pagedList) {
    pagedList.list = pagedList.list.map(questionService.mapItem);
  }

  changeFilter(filter) {
    browserHistory.push(`/know/q/my/${filter}`);
  }

  render() {
    let {pagedList} = this.state;
    let {params} = this.props;
    let {filter = 'asked', pageNo} = params;

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 我的问答
          </h2>
          <div className='btn-group pull-right' role='group'>
            <Button text='提问' className={{ active: filter == 'asked' }} onClick={this.changeFilter.bind(this, 'asked')} />
            <Button text='回答' className={{ active: filter == 'answered' }} onClick={this.changeFilter.bind(this, 'answered')} />
          </div>
        </div>
        <PagedList className='flex-scroll' data={pagedList}
          toPage={`/know/q/my/${filter}`}
        />
      </div>
    )
  }
}
