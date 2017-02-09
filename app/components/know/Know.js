import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import Sidebar from '../Sidebar';
import { select } from '../../utils';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: {
        title: "大牛",
        searchbar: {
          onSearch: (query) => {
            browserHistory.push(`/know/q/search/${encodeURIComponent(query)}`);
          }
        },
        sections: [
          {
            header: { label: '问答' },
            body: [
              { label: '最新问答', icon: 'list', to: '/know/q/latest' },
              { label: '热门问答', icon: 'list', to: '/know/q/hot' },
              { label: '未回答问答', icon: 'list', to: '/know/q/unanswered' },
              { label: '我的问答', icon: 'user', to: '/know/q/my' },
            ]
          },
          {
            header: { label: '头条' },
            body: [
              { label: '最新头条', icon: 'list', to: '/know/b/latest' },
              { label: '热门头条', icon: 'list', to: '/know/b/hot' },
              { label: '我的头条', icon: 'user', to: '/know/b/my' },
            ]
          },
        ]
      }
    };
  }

  handleAdd(event) {
    select.selectMenu(event.currentTarget, null,
      selecting => {
        browserHistory.push(selecting.to);
      }, {
        align: 'right',
        style: { width: 120 },
        data: [
          { to: '/know/b/add', name: '发表头条' },
          { to: '/know/q/add', name: '提问' },
        ]
      });
  }

  render() {
    return (
      <div className='main-container'>
        <Sidebar data={this.state.sidebar} onAdd={this.handleAdd.bind(this)} />
        <div className='main-content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}