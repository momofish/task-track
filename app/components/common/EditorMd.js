import React, { Component } from 'react';

const id_default = 'editormd';

export default class EditorMd extends Component {
  componentDidMount() {
    let {id = id_default, lazy} = this.props;

    if (lazy)
      $(`#${id} textarea`).focus(this.loadEditmd.bind(this));
    else
      this.loadEditmd();
  }

  loadEditmd() {
    let {id = id_default, height = 400, placeholder = '请输入内容，可使用mark-down语法，右边为内容预览'} = this.props;

    let editor = this.editormd = editormd(id, {
      height,
      path: '/editor.md/lib/',
      placeholder,
      toolbarIcons: editormd.toolbarModes.full,
      emoji: true,
      onload() {
        $(`#${id} .fa[name=info]`).closest('li').remove();
        editor.watch();
      }
    });
  }

  render() {
    let {id = id_default, value = ''} = this.props;

    return (
      <div id={id} className='form-group'>
        <textarea value={value} onChange={() => { }} ref={text => this.text = text} rows='10' className='form-control' />
      </div>
    );
  }
}