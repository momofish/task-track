import React from 'react';
import {Link} from 'react-router';
import SidebarStore from '../stores/SidebarStore';
import SidebarActions from '../actions/SidebarActions';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = SidebarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    SidebarStore.listen(this.onChange);
  }

  componentWillUnmount() {
    SidebarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <nav className='sidebar'>
        <div className='sidebar-header'>
          sidebar
        </div>
        <div>
          <ul className='nav sidebar-nav'>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Sidebar;