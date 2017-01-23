import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { times } from 'lodash';

export default class Pagination extends Component {
  render() {
    let {pagination, to} = this.props;

    if (!pagination)
      return null;

    let {pageNo = 1, pageSize, totalCount} = this.props.pagination;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageWindow = 5;
    let pageNoMin = pageNo - (pageWindow - 1) / 2;
    pageNoMin = pageNoMin < 1 ? 1 : pageNoMin;
    let pageNoMax = pageNoMin + pageWindow - 1;
    pageNoMax = pageNoMax > pageCount ? pageCount : pageNoMax;

    return (
      <nav>
        <ul className="pagination pagination-sm">
          <li className={classnames({ disabled: pageNo <= 1 })}><Link to={`${to}`}>&laquo;</Link></li>
          {times(pageNoMax - pageNoMin + 1, n => <li key={n} className={classnames({ active: pageNo == pageNoMin + n })}><Link to={`${to}/${pageNoMin + n}`}>{pageNoMin + n}</Link></li>)}
          <li className={classnames({ disabled: pageNo >= pageCount })}><Link to={`${to}/${pageCount}`}>&raquo;</Link></li>
        </ul>
      </nav>
    );
  }
}