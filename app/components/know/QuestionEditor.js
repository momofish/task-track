import React, { Component } from 'react';

export default class QuestionEditor extends Component {
  componentDidMount() {
    editormd('editormd');
  }

  render() {
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 提问
          </h2>
        </div>
        <div id='editormd'>
          <textarea style={{ display: 'none' }}></textarea>
        </div>
      </div>
    );
  }
}