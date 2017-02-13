import React, { Component } from 'react';
import { Link } from 'react-router';

import { PagedList } from '../common';
import { knowService, questionService, blogService } from '../../services';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    this.getData();
  }

  async getData() {
    let data = await knowService.getData('latest');
    data.questions = data.questions.map(questionService.mapItem);
    data.blogs = data.blogs.map(blogService.mapItem);
    this.setState(data);
  }

  render() {
    let {questions, blogs} = this.state;

    return (
      <div className='container-fluid flex flex-verticle flex-scroll'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 大牛
          </h2>
        </div>
        <main className='welcome-masthead know'>
          <div className='logo'>
            <img src='/icon/know.png' />
          </div>
          <div className='lead'>
            <p>大牛在此</p>
            <Link to='/know/q/latest' className='btn btn-info'>开始解惑</Link>
          </div>
        </main>
        <div className='row'>
          <div className='col-md-6'>
            <div className="panel panel-default">
              <div className="panel-heading"><h3 className='panel-title'>最新问答</h3></div>
              <div className="panel-body">
                <PagedList data={{ list: questions }} />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className="panel panel-default">
              <div className="panel-heading"><h3 className='panel-title'>最新头条</h3></div>
              <div className="panel-body">
                <PagedList data={{ list: blogs }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}