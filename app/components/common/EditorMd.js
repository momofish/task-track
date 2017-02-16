import React, { Component } from 'react';

export default class EditorMd extends Component {
  componentDidMount() {
    let {lazy} = this.props;

    if (lazy)
      $('#editormd textarea').focus(this.loadEditmd.bind(this));
    else
      this.loadEditmd();
  }

  loadEditmd() {
    let {height = 400, placeholder = '请输入内容，可使用mark-down语法，右边为内容预览'} = this.props;

    let editor = this.editormd = editormd('editormd', {
      height,
      path: '/editor.md/lib/',
      toolbarIcons: editormd.toolbarModes['simple'],
      placeholder,
      onload() {
        $('#editormd .fa[name=info]').closest('li').remove();
        editor.watch();
      }
    });
  }

  render() {
    let {value} = this.props;

    return (
      <div id='editormd' className='form-group'>
        <textarea value={value} onChange={() => { }} ref={text => this.text = text} rows='10' className='form-control' />
      </div>
    );
  }
}