import React, {Component} from 'react';
import {GroupList, PadList} from './common';
import Store from '../stores/ProjectTaskStore';
import Actions from '../actions/ProjectTaskActions';
import TaskDetail from './TaskDetail';
import QuickAdd from './QuickAdd';
import {select} from '../utils';
import {taskTreat} from '../models';

const selectors = [{ key: 'project', idGetter: project => project._id, nameGetter: project => project.name, type: 'selectProject', label: '选择项目' }];

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
    let task = { title: quick.title, project: this.state.project };
    Actions.addTask(task, form);
  }

  selectTask(task, event) {
    Actions.selectTask(task);
  }

  clickTag(task, tag, event) {
    event.stopPropagation();
    if (tag.code === 'treat') {
      select.selectMenu(event.currentTarget, tag.data, treat => {
        Actions.updateTaskDetail({ _id: task._id, treat: treat.key });
      }, { align: 'right', data: taskTreat });
    }
  }

  selectFilter(event) {
    Actions.selectFilter(event.currentTarget, this.state.filter);
  }

  render() {
    let {project, tasks, selectedTask, filter, quickAdd, taskGroups} = this.state;

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
        <QuickAdd data={quickAdd} placeHolder='快速添加新任务' onSubmit={this.addTask.bind(this) } />
        {filter.mode == 'pad' ?
          <PadList  data={taskGroups} onSelect={this.selectTask} onClickTag={this.clickTag} /> :
          <GroupList data={taskGroups} onSelect={this.selectTask} onClickTag={this.clickTag} />
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