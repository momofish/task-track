import React, { Component } from 'React';

export default class MyQuestions extends Component {
  render() {
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 我的问答
          </h2>
        </div>
      </div>
    )
  }
}