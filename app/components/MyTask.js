import React from 'react';
import {Link} from 'react-router';
import EntryList from './EntryList';
import MyTaskStore from '../stores/MyTaskStore';
import MyTaskActions from '../actions/MyTaskActions';

class MyTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = MyTaskStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MyTaskStore.listen(this.onChange);
    
    // load data
    MyTaskActions.getMyTasks();
  }

  componentWillUnmount() {
    MyTaskStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container-fluid'>
        <h4 className='page-header'>
          <i className='glyphicon glyphicon-tasks' /> 我的任务
        </h4>
        <EntryList data={this.state.data} />
      </div>
    );
  }
}

export default MyTask;