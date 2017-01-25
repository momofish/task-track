import React, { Component } from 'react';

export default class Article extends Component {
  render() {
    let {content, col, options} = this.props;

    return (
      <article>
        {col && <div className='article-viewer-column'>{col}</div>}
        <div className='flex flex-verticle'>
          <div className='content' dangerouslySetInnerHTML={{ __html: content }} ></div>
          {options && <ul className='options'>
            {options.map((option, i) => <li key={i}>{option}</li>)}
          </ul>}
        </div>
      </article>
    );
  }
}