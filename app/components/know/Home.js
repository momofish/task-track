import React, { Component } from 'react';
import { Link } from 'react-router';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className='container-fluid flex flex-verticle'>
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
            <Link to='/know/b/latest' className='btn btn-info'>开始解惑</Link>
          </div>
        </main>
      </div>
    );
  }
}