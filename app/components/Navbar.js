import React, {Component} from 'react';
import {Link} from 'react-router';

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <nav className='navbar navbar-vertical-left'>
        <div className='navbar-header'>
          <Link to='/' className='navbar-brand'>
            T T
          </Link>
        </div>
        <div>
          <ul className='nav navbar-nav'>
            <li><Link to='/tasks' activeClassName='active'><i className='glyphicon glyphicon-tasks' /></Link></li>
            <li><Link to='/calendar'><i className='glyphicon glyphicon-calendar' /></Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;