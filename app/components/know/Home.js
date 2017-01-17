import React, { Component } from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> Task Track
          </h2>
        </div>
        <main className='welcome-masthead orange'>
          <div className='logo'>
            <img src='/favicon.png' />
          </div>
          <div className='lead'>
            <p></p>
            <p></p>
          </div>
        </main>
      </div>
    );
  }
}