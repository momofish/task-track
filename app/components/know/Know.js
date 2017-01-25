import React, { Component } from 'react';

import Sidebar from '../Sidebar';

export default class Know extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: {
        title: "大牛",
        searchbar: { onSearch: () => { } },
        sections: [
          {
            header: { label: '问答' },
            body: [
              { label: '最新问答', icon: 'list', to: '/know/q/latest' },
              { label: '热门问答', icon: 'list', to: '/know/q/hot' },
              { label: '未回答问答', icon: 'list', to: '/know/q/unanswered' },
              { label: '我的问答', icon: 'user', to: '/know/q/my' },
            ]
          }
        ]
      }
    };
  }

  render() {
    return (
      <div className='main-container'>
        <Sidebar data={this.state.sidebar} />
        <div className='main-content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}