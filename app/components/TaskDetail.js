import React, {Component} from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import {extend} from 'underscore';
import classnames from 'classnames';
import Modal from './Modal';
import PopBox from './PopBox';
import Selector from './Selector';
import EditableText from './EditableText';
import TaskDetailStore from '../stores/TaskDetailStore';
import TaskDetailActions from '../actions/TaskDetailActions';
import {projectService} from '../services';
import {select} from '../utils';

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = TaskDetailStore.getState();

    this.onChange = this.onChange.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.selectDueDate = this.selectDueDate.bind(this);
  }

  componentDidMount() {
    TaskDetailStore.listen(this.onChange);
    TaskDetailActions.getTaskDetail(this.props.task._id);
  }

  componentWillUnmount() {
    TaskDetailStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  dismiss() {
    this.props.onHidden(this.state.updated);
  }

  updateTaskDetail(task) {
    TaskDetailActions.updateTaskDetail(extend({
      _id: this.state.task._id
    }, task), task);
  }

  completeTask(event) {
    let task = this.state.task;
    task.completed = event.currentTarget.checked;
    TaskDetailActions.updateTaskDetail({
      _id: task._id, completed: task.completed
    });
  }

  selectProject(event) {
    event.preventDefault();
    let task = this.state.task;
    select.selectProject(event.currentTarget, task.project, (project) => {
      TaskDetailActions.updateTaskDetail({
        _id: task._id, project: project._id
      }, { project });
    });
  }

  selectMember(selected, field, event) {
    let task = this.state.task
    if(!task.project)
    {
      toastr.error('请先选择项目');
      return;
    }
    select.selectMember(event.currentTarget, selected, selecting => {
      let newTask =  { _id: task._id };
      newTask[field] = selected instanceof Array ? 
        selecting.map(m => m._id) : selecting._id;
      let populated = {};
      populated[field] = selecting;
      TaskDetailActions.updateTaskDetail(newTask, populated);
    }, { _id: task.project && task.project._id });
  }

  selectDueDate(event) {
    let task = this.state.task
    select.selectDate(event.currentTarget, moment(task.dueDate), date => {
      TaskDetailActions.updateTaskDetail({
        _id: task._id, dueDate: date.toString()
      }, { dueDate: date });
    });
  }

  render() {
    let task = this.state.task || this.props.task;
    let project = task.project || { projectName: '未分配项目' };
    let assignee = task.assignee || { name: '未分配' };
    let completed = task.completed;
    let className = classnames('form-title', { completed });
    return (
      <Modal onHidden={this.dismiss}>
        <div className="modal-header">
          <button type='button' className='close' data-dismiss='modal'>
            <span aria-hidden='true'>×</span>
            <span className='sr-only'>Close</span>
          </button>
          <Link to={`/tasks/projects/${project.projectId}`} onClick={(event) => { if (!project.projectId) { event.preventDefault(); this.selectProject(event) } } }>
            {project.projectName} <i className='glyphicon glyphicon-menu-down' onClick={this.selectProject} />
          </Link>
        </div>
        <div className='modal-body smart-form'>
          <div className='form-item'>
            <div className='item-label'>
              <label className='form-title'>
                <input type='checkbox' checked={completed} onChange={this.completeTask} />
              </label>
            </div>
            <div className='item-content'><EditableText className={className} text={task.title} onChange={(text) => this.updateTaskDetail({ title: text }) } /></div>
          </div>
          <div className='form-item'>
            <div className='item-label'></div>
            <div className='item-content'>
              <button className='btn btn-link' onClick={this.selectMember.bind(this, task.assignee, 'assignee')}><i className='glyphicon glyphicon-user' /> {assignee.name}</button>
            </div>
            <div className='item-content'>
              <a href='javascript:' onClick={this.selectDueDate}>
                <i className='glyphicon glyphicon-calendar' /> {task.dueDate ? moment(task.dueDate).format('L') : '截止日期'}
              </a>
            </div>
          </div>
          <div className='form-item'>
            <div className='item-label'></div>
            <div className='item-content'>
              <EditableText multiline='true' text={task.description} placeholder='添加描述' onChange={(text) => this.updateTaskDetail({ description: text }) } />
            </div>
          </div>
          <div className='form-item'>
            <div className='item-label'>参与</div>
            <div className='item-content'>
              {task.parts.map((member, i) => (
                <button key={i} className="btn btn-link"><i className='glyphicon glyphicon-user' /> {member.name}</button>
              ))}
              <button type="button" className="btn btn-default" onClick={this.selectMember.bind(this, task.parts, 'parts')}>
                <span className="glyphicon glyphicon-plus"></span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default TaskDetail;