import React, { Component } from 'react';
import classnames from 'classnames';

import { ListItem, Pagination } from '.';

export default class PagedList extends Component {
  render() {
    let {data, className, to} = this.props;
    let {list, pagination} = data;

    return (
      <div>
        <ul className={classnames('common-list', className)}>
          {list && list.map((item, i) => <ListItem key={i} item={item} />)}
        </ul>
        <Pagination pagination={pagination} to={to} />
      </div>
    );
  }
}