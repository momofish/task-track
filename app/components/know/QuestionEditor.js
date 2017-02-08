import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import _ from 'lodash';

import { FormItem } from '../common';
import { questionService, tagService } from '../../services';
import { select } from '../../utils';

export default class QuestionEditor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { question: { tags: [] }, tags: null };
  }

  componentDidMount() {
    let {question, tags} = this.state;

    $('#tags').find('.form-control').focus(async input => {
      if (!tags) {
        tags = await tagService.getTags();
      }
      let dataSources = _.chain(tags)
        .groupBy(tag => tag.category)
        .toPairs()
        .map(pair => ({ name: pair[0], data: pair[1] }))
        .value();

      select.selectData(input.target, question.tags,
        selecting => {
          this.selectTags(selecting);
        }, { dataSources })
    });

    editormd('editormd', {
      height: 640,
      path: '/editor.md/lib/'
    });
  }

  selectTags(tags) {
    let {question} = this.state;
    question.tags = tags;
    this.forceUpdate();
  }

  deleteTag(i) {
    let {question} = this.state;
    let {tags} = question;
    tags.splice(i, 1);
    this.forceUpdate();
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
    question.content = this.$content.value;
    if (!question.content) {
      toastr.danger(`请输入内容`);
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
            <input className='form-control' placeholder='标题，一句话说清问题' defaultValue={title}
              onChange={this.changeEntity.bind(this, 'title')} />
          </FormItem>
          <FormItem noLabel id='tags'>
            <ReactTags
              placeholder='标签' labelField={'name'}
              classNames={{
                selected: 'input-group',
                tag: 'input-group-addon',
                remove: 'glyphicon',
                tagInput: '',
                tagInputField: 'form-control'
              }}
              tags={question.tags}
              handleAddition={() => { }}
              handleDelete={this.deleteTag.bind(this)}
            />
          </FormItem>
          <div id='editormd'>
            <textarea ref={text => this.$content = text} style={{ display: 'none' }} />
          </div>
          <FormItem noLabel>
            <button type='submit' disabled={!title} className='btn btn-primary btn-sm'>发布问题</button>
            <button type='button' className='btn btn-link btn-sm'
              onClick={this.goto.bind(this, null)}>舍弃</button>
          </FormItem>
        </div>
      </form>
    );
  }
}