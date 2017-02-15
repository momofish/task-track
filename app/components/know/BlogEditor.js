import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import _ from 'lodash';

import { FormItem } from '../common';
import { blogService, tagService } from '../../services';
import { select } from '../../utils';

export default class extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { blog: { title: '', tags: [] }, tags: null };
  }

  async componentDidMount() {
    $('#tags').find('.form-control').focus(async input => {
      let {blog, tags} = this.state;

      if (!tags) {
        tags = await tagService.getTags();
      }
      let dataSources = _.chain(tags)
        .groupBy(tag => tag.category)
        .toPairs()
        .map(pair => ({ name: pair[0], data: pair[1] }))
        .value();

      select.selectData(input.target, blog.tags,
        selecting => {
          this.selectTags(selecting);
        }, { dataSources })
    });

    await this.getData(this.props.params);

    this.editormd = editormd('editormd', {
      height: 640,
      path: '/editor.md/lib/'
    });
  }

  componentWillUnmount() {
    this.editormd.editor.remove();
  }

  async getData(params) {
    let {id} = params;
    if (!id)
      return;

    let blog = await blogService.getBlog(id);
    this.setState({ blog });
  }

  selectTags(tags) {
    let {blog} = this.state;
    blog.tags = tags;
    this.forceUpdate();
  }

  deleteTag(i) {
    let {blog} = this.state;
    let {tags} = blog;
    tags.splice(i, 1);
    this.forceUpdate();
  }

  changeEntity(field, event) {
    let {blog} = this.state;
    blog[field] = event.target.value;
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

    let {blog} = this.state;
    blog.content = this.$content.value;
    if (!blog.content) {
      toastr.error(`请输入内容`);
      return;
    }
    await blogService.saveBlog(blog);
    this.goto('/know/b/latest');
  }

  render() {
    let {blog} = this.state;
    let {title, content} = blog;

    return (
      <form className='container-fluid flex flex-verticle' onSubmit={this.handleSubmit.bind(this)}>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 发表文章
          </h2>
        </div>
        <div className='smart-form'>
          <FormItem noLabel>
            <input className='form-control' placeholder='标题，言简意赅' value={title}
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
              tags={blog.tags}
              handleAddition={() => { }}
              handleDelete={this.deleteTag.bind(this)}
            />
          </FormItem>
          <div id='editormd'>
            <textarea value={blog.content} ref={text => this.$content = text} style={{ display: 'none' }} />
          </div>
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