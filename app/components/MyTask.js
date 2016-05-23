import React from 'react';
import {Link} from 'react-router';
import GroupList from './GroupList';
import MyTaskStore from '../stores/MyTaskStore';
import MyTaskActions from '../actions/MyTaskActions';
import QuickAdd from './QuickAdd';
import TaskDetail from './TaskDetail';

class MyTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = MyTaskStore.getState();
    this.onChange = this.onChange.bind(this);
    this.showTask = this.showTask.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  componentDidMount() {
    MyTaskStore.listen(this.onChange);
    MyTaskActions.getMyTasks();
  }

  componentWillUnmount() {
    MyTaskStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  addTask(quick, form) {
    MyTaskActions.addTask({ title: quick.title }, form);
  }

  showTask(task) {
    MyTaskActions.showTask(task);
  }

  render() {
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 我的任务
          </h2>
          <div className="btn-group pull-right">
            <button type="button" className="btn btn-info" disabled>
              <span className="glyphicon glyphicon-list-alt" />
            </button>
            <button type="button" className="btn btn-default">
              按优先级 <i className="caret" />
            </button>
          </div>
        </div>
        <QuickAdd title={this.state.quickAddTitle} placeHolder='快速添加新任务' onSubmit={this.addTask} />
        <GroupList data={this.state.tasks} onSelect={this.showTask} />
        {this.state.showingTask && <TaskDetail task={this.state.showingTask} onHidden={(updated) => { this.showTask(null); updated && MyTaskActions.getMyTasks(); } } />}
      </div>
    );
  }
}

export default MyTask;