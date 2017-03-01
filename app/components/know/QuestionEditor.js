import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import _ from 'lodash';

import { FormItem, EditorMd } from '../common';
import { questionService, tagService } from '../../services';
import { select } from '../../utils';

const placeholder = `1. 描述你的问题

2. 贴上相关代码

3. 贴上报错信息

4. 贴上相关截图

5. 已经尝试过哪些方法仍然没解决（附上相关链接）`;

export default class extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { question: { title: '', tags: [] }, tags: null };
  }

  async componentDidMount() {
    $('#tags').find('.form-control').focus(async input => {
      let {question, tags} = this.state;

      if (!tags) {
        tags = await tagService.getTags();
      }
      let dataSources = _.chain(tags)
        .groupBy(tag => tag.category)
        .toPairs()
        .map(pair => ({ name: pair[0], data: pair[1], searchable: true }))
        .value();

      select.selectData(input.target, question.tags,
        selecting => {
          this.selectTags(selecting);
        }, { dataSources })
    });

    await this.getData(this.props.params);
  }

  async getData(params) {
    let {id} = params;
    if (!id)
      return;

    let question = await questionService.getQuestion(id);
    this.setState({ question });
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
    if (event.target != event.currentTarget)
      return;
    event.preventDefault();

    let {question} = this.state;
    question.content = this.editor.text.value;
    if (!question.content) {
      toastr.error(`请输入内容`);
      return;
    }
    let {_id, title, tags, content} = question;
    await questionService.saveQuestion({ _id, title, tags, content });
    this.goto('/know/q/latest');
  }

  render() {
    let {question} = this.state;
    let {title, content} = question;

    return (
      <form className='container-fluid flex flex-verticle flex-scroll' onSubmit={this.handleSubmit.bind(this)}>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 提问
          </h2>
        </div>
        <div className='smart-form'>
          <FormItem noLabel>
            <input type='text' className='form-control' placeholder='标题，一句话说清问题' value={title}
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
              autofocus={false}
              tags={question.tags}
              handleAddition={() => { }}
              handleDelete={this.deleteTag.bind(this)}
            />
          </FormItem>
          <EditorMd lazy value={content} ref={editor => this.editor = editor} placeholder={placeholder} />
          <FormItem noLabel>
            <button type='submit' disabled={!title} className='btn btn-primary btn-sm'>发布</button>
            <button type='button' className='btn btn-link btn-sm'
              onClick={this.goto.bind(this, null)}>舍弃</button>
          </FormItem>
        </div>
      </form>
    );
  }
}