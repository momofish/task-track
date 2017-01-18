import React, { Component } from 'React';

import { PagedList } from '../common';

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: { code: null, name: '分类' }, tags: [],
      questions: {
        paging: { pageIndex: 0, pageSize: 30, recordCount: 0 },
        list: [{ label: 'title 1', tags: [{label: 'test'}], meta: 'meta' }]
      }
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
        </div>
        <PagedList data={questions}></PagedList>
      </div>
    )
  }
}