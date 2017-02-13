import React, { Component } from 'react';
import { Link } from 'react-router';

import {Modal} from './common';
import ArticleViewer from './ArticleViewer';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  viewArticle(title, path) {
    Modal.open({
      header: title || '无标题',
      body: <ArticleViewer path={path} />,
      size: 'lg'
    });
  }

  render() {
    return (
      <div className='container-fluid flex flex-verticle flex-scroll'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> Task Track
          </h2>
        </div>
        <main className='welcome-masthead'>
          <div className='logo'>
            <img src='/favicon.png' />
          </div>
          <div className='lead'>
            <p>更简单的任务管理</p>
            <p>快速分配任务，看板视图，工作量填报神器</p>
            <Link to='/tasks/my' className='btn btn-info'>立即开启</Link>
          </div>
        </main>
        <div className='welcome-features'>
          <h3>如何使用Task Track</h3>
          <div className='row split'>
            <div className='col-sm-4'>
              <h4>新手入门</h4>
              <p>了解Task Track基本概念和任务管理基本流程，快速应用于学习和工作</p>
              <p><a className="btn btn-default" onClick={this.viewArticle.bind(this, '新手入门', 'quick-start')}>立即学习</a></p>
            </div>
            <div className='col-sm-4'>
              <h4>进阶使用</h4>
              <p>掌握Task Track使用技巧，让其更加顺手</p>
              <p><a className="btn btn-default" onClick={this.viewArticle.bind(this, '进阶使用', 'futher-use')}>进去看看</a></p>
            </div>
            <div className='col-sm-4'>
              <h4>常见问题</h4>
              <p>一些常见问题汇总，都在这里咯</p>
              <p><a className="btn btn-default" onClick={this.viewArticle.bind(this, '常见问题', 'faq')}>看了就知道</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;