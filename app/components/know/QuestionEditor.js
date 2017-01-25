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
      path: "/editor.md/lib/"
    });
  }

  changeEntity(field, event) {
    let {question} = this.state;
    question[field] = event.target.value;
    this.forceUpdate();
  }

  goto(url) {
    let {router} = this.props;
    if (url) {
      router.push(url);
      return;
    }
    router.goBack();
  }

  async handleSubmit(event) {
    event.preventDefault();

    let {question} = this.state;
    question.content = this._questionText.value;
    if (!question.content) {
      alert(`请输入内容`);
      return;
    }
    await questionService.saveQuestion(question);
    this.goto('/know/q/latest');
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
            <input className="form-control" placeholder="标题，一句话说清问题" defaultValue={title} onChange={this.changeEntity.bind(this, 'title')} />
          </FormItem>
          <div id='editormd'>
            <textarea ref={text => this._questionText = text} style={{ display: 'none' }} />
          </div>
          <FormItem noLabel>
            <button type='submit' disabled={!title} className='btn btn-primary btn-sm'>发布问题</button>
            <button type='button' className='btn btn-link btn-sm' onClick={this.goto.bind(this, null)}>舍弃</button>
          </FormItem>
        </div>
      </form>
    );
  }
}