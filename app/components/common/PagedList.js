import React, { Component } from 'react';
import classnames from 'classnames';

import { ListItem, Pagination } from '.';

export default class PagedList extends Component {
  render() {
    let {data, className, toPage, to, onClick, children} = this.props;
    let {list, pagination} = data;

    return (
      <div className={classnames('common-list', className)}>
        <ul>
          {list && list.map((item, i) => <ListItem key={i} item={item} onClick={onClick && onClick.bind(item)}>{item.content}</ListItem>)}
        </ul>
        <Pagination pagination={pagination} toPage={toPage} />
        {children}
      </div>
    );
  }
}