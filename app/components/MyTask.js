import React from 'react';
import {Link} from 'react-router';
import GroupList from './GroupList';
import MyTaskStore from '../stores/MyTaskStore';
import MyTaskActions from '../actions/MyTaskActions';
import QuickAdd from './QuickAdd';
import TaskDetail from './TaskDetail';
import select from '../utils/select';

class MyTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = MyTaskStore.getState();
    this.onChange = this.onChange.bind(this);
    this.setTask = this.setTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.quickAddSelect = this.quickAddSelect.bind(this);
  }

  componentDidMount() {
    MyTaskStore.listen(this.onChange);
    MyTaskActions.getMyTasks(this.state.filter.query);
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

  setTask(task) {
    MyTaskActions.setTask(task);
  }

  selectFilter(event) {
    MyTaskActions.selectFilter(event.currentTarget, this.state.filter);
  }

  quickAddSelect(event) {
    let quickAdd = this.state.quickAdd;
    select.selectProject(event.currentTarget, quickAdd.project, project => {
    }, {align: 'right'});
  }

  render() {
    var showingTask = this.state.showingTask;
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 我的任务
          </h2>
          <div className="btn-group pull-right" onClick={this.selectFilter}>
            <button type="button" className="btn btn-info" disabled>
              <span className="glyphicon glyphicon-list-alt" />
            </button>
            <button type="button" className="btn btn-default" style={{ width: 180 }}>
              {this.state.filter.name} <i className="caret" />
            </button>
          </div>
        </div>
        <QuickAdd data={this.state.quickAdd} placeHolder='快速添加新任务' onSubmit={this.addTask} selectors={[{ key: 'project', onClick: this.quickAddSelect, label: '选择项目' }]} />
        <GroupList data={this.state.taskGroups} onSelect={this.setTask} />
        {showingTask && <TaskDetail task={showingTask} onHidden={updated => { this.setTask(); updated && MyTaskActions.getMyTasks(this.state.filter.query); } } />}
      </div>
    );
  }
}

export default MyTask;