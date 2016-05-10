import React from 'react';
import {Link} from 'react-router';
import EntryList from './EntryList';
import MyTaskStore from '../stores/MyTaskStore';
import MyTaskActions from '../actions/MyTaskActions';
import QuickAdd from './QuickAdd';
import TaskDetail from './TaskDetail';

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
  
  addTask(quick, form) {
    MyTaskActions.addTask({title: quick.title}, form);
  }
  
  showTask(task) {
    MyTaskActions.showTask(task);
  }

  render() {
    return (
      <div className='container-fluid'>
        <h4 className='page-header'>
          <i className='glyphicon glyphicon-tasks' /> 我的任务
        </h4>
        <QuickAdd title={this.state.quickAddTitle} placeHolder='快速添加新任务' onSubmit={this.addTask.bind(this)} />
        <EntryList data={this.state.tasks} onSelect={this.showTask.bind(this)} />
        {this.state.showingTask && <TaskDetail task={this.state.showingTask} onHidden={() => this.showTask(null)} />}
      </div>
    );
  }
}

export default MyTask;