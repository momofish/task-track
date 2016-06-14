import React, {Component} from 'react';
import {GroupList} from './common';
import ProjectStore from '../stores/ProjectStore';
import ProjectActions from '../actions/ProjectActions';
import TaskDetail from './TaskDetail';
import QuickAdd from './QuickAdd';
import {select} from '../utils';
import {taskTreat} from '../models';

const selectors = [{ key: 'project', idGetter: project => project._id, nameGetter: project => project.name, type: 'selectProject', label: '选择项目' }];

class ProjectTask extends Component {
  constructor(props) {
    super(props);
    this.state = ProjectStore.getState();

    this.onChange = this.onChange.bind(this);
    this.selectTask = this.selectTask.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
  }

  componentDidMount() {
    ProjectStore.listen(this.onChange);
    ProjectActions.getProject(this.props.params.id);
  }

  componentWillUnmount() {
    ProjectStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    ProjectActions.getProject(nextProps.params.id);
  }

  onChange(state) {
    this.setState(state);
  }

  addTask(quick, form) {
    let task = { title: quick.title, project: this.state.project };
    ProjectActions.addTask(task, form);
  }

  selectTask(task, event) {
    ProjectActions.selectTask(task);
  }

  clickTag(task, tag, event) {
    event.stopPropagation();
    if (tag.code === 'treat') {
      select.selectMenu(event.currentTarget, tag.data, treat => {
        ProjectActions.updateTaskDetail({ _id: task._id, treat: treat.key });
      }, { align: 'right', data: taskTreat });
    }
  }

  selectFilter(event) {
    ProjectActions.selectFilter(event.currentTarget, this.state.filter);
  }

  render() {
    let project = this.state.project;
    let tasks = this.state.tasks;
    let selectedTask = this.state.selectedTask;
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
              {this.state.filter.name} <i className="caret" />
            </button>
          </div>
        </div>
        <QuickAdd data={this.state.quickAdd} placeHolder='快速添加新任务' onSubmit={this.addTask.bind(this)} />
        <GroupList data={this.state.taskGroups} onSelect={this.selectTask} onClickTag={this.clickTag} />
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          ProjectActions.selectTask();
          updated && ProjectActions.getTasks();
        } } />}
      </div>
    );
  }
}

export default ProjectTask;