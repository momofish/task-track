import React, { Component } from 'react';
import classnames from 'classnames';

import { ListItem } from '.';

export default class PagedList extends Component {
  render() {
    let {data, className} = this.props;
    let {list} = data;

    return (
      <div>
        <ul className={classnames('common-list', className)}>
          {list && list.map((item, i) => <ListItem key={i} item={item} />)}
        </ul>
      </div>
    );
  }
}