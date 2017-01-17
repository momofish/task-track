import React, { Component } from 'react';
import { Link } from 'react-router';

import { userService } from '../services';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let currentUser = await userService.getCurrentUser();
    this.setState({ currentUser })
  }

  componentWillUnmount() {
  }

  render() {
    let {currentUser} = this.state;
    return (
      <nav className='navbar navbar-vertical-left'>
        <div className='navbar-header'>
          <Link to='/' className='navbar-brand'>
            W
          </Link>
        </div>
        <div className='navbar-content'>
          <ul className='nav navbar-nav'>
            <li><Link to='/tasks' activeClassName='active'><i className='glyphicon glyphicon-tasks' /></Link></li>
            <li><Link to='/know' activeClassName='active'><i className='glyphicon glyphicon-ok' /></Link></li>
          </ul>
        </div>
        <div className='navbar-footer'>
          <a >{(currentUser || {}).name}</a>
        </div>
      </nav>
    );
  }
}

export default Navbar;