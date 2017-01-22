import React, { Component } from 'react';

import { FormItem } from '../common';
import { questionService } from '../../services';

export default class QuestionEditor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { question: {} };
  }

  componentDidMount() {
    let {question} = this.state;
    let that = this;
    editormd('editormd', {
      height: 640,
      path: "/editor.md/lib/",
      onchange: function () {
        question.content = this.getMarkdown();
        that.forceUpdate();
      }
    });
  }

  changeEntity(field, event) {
    let {question} = this.state;
    question[field] = event.target.value;
    this.forceUpdate();
  }

  goto(url) {
    let {history} = this.props;
    if (url) {
      history.pushState(null, url);
      return;
    }
    history.goBack();
  }

  async handleSubmit(event) {
    event.preventDefault();

    let {question} = this.state;
    await questionService.saveQuestion(question);
    this.goto(null, '/know/q/latest');
  }

  render() {
    let {question} = this.state;
    let {title, content} = question;

    return (
      <form className='container-fluid flex flex-verticle' onSubmit={this.handleSubmit.bind(this)}>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 提问
          </h2>
        </div>
        <div className='smart-form'>
          <FormItem noLabel>
            <input className="form-control" placeholder="标题，一句话说清问题" value={title} onChange={this.changeEntity.bind(this, 'title')} />
          </FormItem>
          <div id='editormd'>
            <textarea ref='editormd' style={{ display: 'none' }} value={content} />
          </div>
          <FormItem noLabel>
            <button type='submit' disabled={!title || !content} className='btn btn-primary btn-sm'>发布问题</button>
            <button type='button' className='btn btn-link btn-sm' onClick={this.goto.bind(this, null)}>舍弃</button>
          </FormItem>
        </div>
      </form>
    );
  }
}