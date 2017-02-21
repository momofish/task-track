import React, { Component } from 'react';
import { Link } from 'react-router';

import { userService } from '../../services';

export default class extends Component {
  render() {
    let {author} = this.props;
    if (!author)
      return null;
    let {currentUser} = userService;

    return (
      <Link to={`/know/q/u/${author.loginId}`} className='tag tag-info'>
        {author._id == currentUser._id ? '我' : (author || { name: '匿名' }).name}
      </Link>
    );
  }
}