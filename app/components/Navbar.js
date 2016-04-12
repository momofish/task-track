import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
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
            <li><Link to='/tasks/my' activeClassName='active'><i className='glyphicon glyphicon-tasks' /></Link></li>
            <li><Link to='/calendar/my'><i className='glyphicon glyphicon-calendar' /></Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;