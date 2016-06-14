import React, {Component} from 'react';
import {GroupList} from './common';
import MyTaskStore from '../stores/MyTaskStore';
import MyTaskActions from '../actions/MyTaskActions';
import QuickAdd from './QuickAdd';
import TaskDetail from './TaskDetail';
import {select} from '../utils';
import {taskTreat} from '../models';

const selectors = [{ key: 'project', idGetter: project => project._id, nameGetter: project => project.name, type: 'selectProject', label: '选择项目' }];

class MyTask extends Component {
  constructor(props) {
    super(props);
    this.state = MyTaskStore.getState();
    
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MyTaskStore.listen(this.onChange);
    MyTaskActions.getTasks(this.props.params.category);
  }

  componentWillUnmount() {
    MyTaskStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    MyTaskActions.getTasks(nextProps.params.category || 'my',
      this.state.filter.query);
  }

  onChange(state) {
    this.setState(state);
  }

  addTask(quick, form) {
    let task = { title: quick.title };
    selectors.forEach(selector => task[selector.key] = quick[selector.key] && selector.idGetter(quick[selector.key]));
    MyTaskActions.addTask(task, form);
  }

  selectTask(task, event) {
    MyTaskActions.selectTask(task);
  }

  clickTag(task, tag, event) {
    event.stopPropagation();
    if (tag.code === 'treat') {
      select.selectMenu(event.currentTarget, tag.data, treat => {
        MyTaskActions.updateTaskDetail({ _id: task._id, treat: treat.key });
      }, { align: 'right', data: taskTreat });
    }
  }

  selectFilter(event) {
    MyTaskActions.selectFilter(event.currentTarget, this.state.filter);
  }

  quickAddSelect(event) {
    let quickAdd = this.state.quickAdd;
    select.selectProject(event.currentTarget, quickAdd.project, project => {
    }, { align: 'right' });
  }

  render() {
    let selectedTask = this.state.selectedTask;
    let isPart = this.props.params.category == 'part';
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> {`我${isPart ? '参与' : ''}的任务`} <span className="badge">{this.state.tasks.length}</span>
          </h2>
          <div className="btn-group pull-right" onClick={this.selectFilter.bind(this)}>
            <button type="button" className="btn btn-info" disabled>
              <span className="glyphicon glyphicon-list-alt" />
            </button>
            <button type="button" className="btn btn-default" style={{ width: 180 }}>
              {this.state.filter.name} <i className="caret" />
            </button>
          </div>
        </div>
        {!isPart && <QuickAdd data={this.state.quickAdd} placeHolder='快速添加新任务' onSubmit={this.addTask.bind(this)} selectors={selectors} />}
        <GroupList data={this.state.taskGroups} onSelect={this.selectTask.bind(this)} onClickTag={this.clickTag.bind(this)} />
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          MyTaskActions.selectTask();
          updated && MyTaskActions.getTasks();
        } } />}
      </div>
    );
  }
}

export default MyTask;