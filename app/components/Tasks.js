import React from 'react';
import {Link} from 'react-router';
import Sidebar from './Sidebar';
import TasksStore from '../stores/TasksStore'
import TasksActions from '../actions/TasksActions';

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = TasksStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    TasksStore.listen(this.onChange);
  }

  componentWillUnmount() {
    TasksStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='main-container'>
        <Sidebar data={this.state.sidebar} />
        <div className='main-content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Tasks;