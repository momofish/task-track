import React, { Component } from 'react';
import Markdown from 'markdown-it';
import moment from 'moment';

import { articleService, userService } from '../services';

class ArticleViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.md = new Markdown();
  }

  async componentDidMount() {
    let {path} = this.props;
    let $content = $.ajax(`/${path}.md`), $article = articleService.getByKey(path);

    let content = await $content;
    let html = this.md.render(content || '');
    this.setState({ html });

    let article = await $article;
    article = article || { comments: [] }
    this.setState({ article });
  }

  async addComment(event) {
    event.preventDefault();

    let {newComment, article} = this.state;
    let {path} = this.props;

    let comment = await articleService.addComment(path, { content: newComment, author: userService.currentUser });
    article.comments.push(comment);
    newComment = '';
    this.setState({ newComment, article });
  }

  render() {
    let {html, article, newComment} = this.state;
    return (
      <div className='article'>
        <div className='markdown' dangerouslySetInnerHTML={{ __html: html }}></div>
        <div className='comments'>
          <h3>评论</h3>
          <ul>
            {article && article.comments.length ? article.comments.map((comment, i) =>
              <li key={i}>
                <h5>{comment.author.name}<span className='pull-right'>{moment(comment.createdOn).format('MM-DD hh:mm')} #{i + 1}</span></h5>
                <span dangerouslySetInnerHTML={{ __html: this.md.render(comment.content || '') }}></span>
              </li>
            ) :
              <li>暂无评论，快来坐沙发吧</li>}
          </ul>
          <form className='add-comment' onSubmit={this.addComment.bind(this)}>
            <div className='form-group'>
              <textarea className='form-control' value={newComment} placeholder='请填写评论' onChange={event => this.setState({ newComment: event.target.value })} />
            </div>
            <button className='btn btn-primary' type='submit' disabled={!newComment}>提交</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ArticleViewer;