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
    let {height = 400} = this.props;

    let editor = this.editormd = editormd('editormd', {
      height: height,
      path: '/editor.md/lib/',
      onload() {
        editor.watch();
      }
    });
  }

  render() {
    let {value} = this.props;

    return (
      <div id='editormd' className='form-group'>
        <textarea defaultValue={value} ref={text => this.text = text} rows='10' className='form-control' />
      </div>
    );
  }
}