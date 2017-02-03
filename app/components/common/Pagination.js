import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { times } from 'lodash';

export default class Pagination extends Component {
  render() {
    let {pagination, toPage} = this.props;

    if (!pagination || pagination.totalCount / pagination.pageSize <= 1)
      return null;

    let {pageNo = 1, pageSize, totalCount} = pagination;
    let pageCount = Math.ceil(totalCount / pageSize);
    let pageWindow = 5;
    let pageNoMin = pageNo - (pageWindow - 1) / 2;
    pageNoMin = pageNoMin < 1 ? 1 : pageNoMin;
    let pageNoMax = pageNoMin + pageWindow - 1;
    pageNoMax = pageNoMax > pageCount ? pageCount : pageNoMax;

    return (
      <ul className="pagination pagination-sm">
        <li className={classnames({ disabled: pageNo <= 1 })}><Link to={`${toPage}`}>&laquo;</Link></li>
        {times(pageNoMax - pageNoMin + 1, n => <li key={n} className={classnames({ active: pageNo == pageNoMin + n })}><Link to={`${toPage}/${pageNoMin + n}`}>{pageNoMin + n}</Link></li>)}
        <li className={classnames({ disabled: pageNo >= pageCount })}><Link to={`${toPage}/${pageCount}`}>&raquo;</Link></li>
      </ul>
    );
  }
}