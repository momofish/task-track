import React, {Component} from 'react';
import {GroupList, PadList, QuickAdd} from './common';
import Store from '../stores/ProjectTaskStore';
import Actions from '../actions/ProjectTaskActions';
import TaskDetail from './TaskDetail';
import {select} from '../utils';
import {taskTreat} from '../models';

class ProjectTask extends Component {
  constructor(props) {
    super(props);
    this.state = Store.getState();

    this.onChange = this.onChange.bind(this);
    this.selectTask = this.selectTask.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
    Actions.getProject(this.props.params.id);
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    Actions.getProject(nextProps.params.id);
  }

  onChange(state) {
    this.setState(state);
  }

  addTask(quick, form) {
    let task = { title: quick.title, owner: quick.owner, project: this.state.project };
    Actions.addTask(task, form);
  }

  selectTask(task, event) {
    Actions.selectTask(task);
  }

  clickTag(item, tag, event) {
    event.stopPropagation();
    let task = item.data;
    if (tag.code === 'treat') {
      select.selectMenu(event.currentTarget, tag.data, treat => {
        Actions.updateTaskDetail({ _id: task._id, treat: treat.key });
      }, { align: 'right', data: taskTreat });
    }
    else if (tag.code === 'dueDate') {
      select.selectDate(event.currentTarget, tag.data, dueDate => {
        Actions.updateTaskDetail({ _id: task._id, dueDate });
      }, { align: 'right' });
    }
    else if (tag.code === 'owner') {
      select.selectMember(event.currentTarget, tag.data, owner => {
        Actions.updateTaskDetail({ _id: task._id, owner });
      }, { align: 'right', _id: task.project._id });
    }
  }

  checkTask(item, event) {
    let task = item.data;
    Actions.updateTaskDetail({ _id: task._id, completed: !task.completed });
  }

  selectFilter(event) {
    Actions.selectFilter(event.currentTarget, this.state.filter);
  }

  render() {
    let {project, tasks, selectedTask, filter, quickAdd, taskGroups} = this.state;

    const selectors = [{
      key: 'owner',
      idGetter: owner => owner._id,
      nameGetter: owner => owner.name,
      type: 'selectMember', label: '负责人',
      options: { _id: project._id }
    }];

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-file' />&nbsp;
            {project.name} <span className="badge">{tasks.length}</span>
          </h2>
          <div className="btn-group pull-right" onClick={this.selectFilter}>
            <button type="button" className="btn btn-info" disabled>
              <span className="glyphicon glyphicon-list-alt" />
            </button>
            <button type="button" className="btn btn-default" style={{ width: 180 }}>
              {filter.name} <i className="caret" />
            </button>
          </div>
        </div>
        <QuickAdd data={quickAdd} placeHolder='快速添加新任务' onSubmit={this.addTask.bind(this) } selectors={selectors} />
        {filter.mode == 'pad' ?
          <PadList data={taskGroups}
            onSelect={this.selectTask}
            onClickTag={this.clickTag.bind(this) }
            onCheck={this.checkTask.bind(this) } /> :
          <GroupList data={taskGroups}
            onSelect={this.selectTask}
            onClickTag={this.clickTag.bind(this) }
            onCheck={this.checkTask.bind(this) } />
        }
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          Actions.selectTask();
          updated && Actions.getTasks();
        } } />}
      </div>
    );
  }
}

export default ProjectTask;