import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import Modal from './Modal';
import PopBox from './PopBox';
import Selector from './Selector';
import TaskDetailStore from '../stores/TaskDetailStore';
import TaskDetailActions from '../actions/TaskDetailActions';
import {projectService} from '../services';
import select from '../utils/select';

class TaskDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = TaskDetailStore.getState();
    
    this.onChange = this.onChange.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.selectMember = this.selectMember.bind(this);
  }

  componentDidMount() {
    TaskDetailStore.listen(this.onChange);
    // load data
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
  
  selectProject(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    select.selectProject(ev, this.state.task.project, (project) => {
        TaskDetailActions.updateTaskDetail({
          _id: this.state.task._id, project: project._id
        })
      });
  }
  
  selectMember(ev) {
    ev.preventDefault();
    select.selectMember(ev, this.state.task.assignee, (user) => {
        TaskDetailActions.updateTaskDetail({
          _id: this.state.task._id, assignee: user._id
        })
      }, this.state.task.project);
  }

  render() {
    var task = this.state.task || this.props.task;
    var project = task.project || {projectName: '未分配项目'};
    var assignee = task.assignee || {name: '未分配'};
    return (
      <Modal onHidden={this.dismiss}>
        <div className="modal-header">
          <button type='button' className='close' data-dismiss='modal'>
            <span aria-hidden='true'>×</span>
            <span className='sr-only'>Close</span>
          </button>
          <Link to={'/projects/' + project.projectId} onClick={this.dismiss}>
            {project.projectName} <i className='glyphicon glyphicon-menu-down' onClick={this.selectProject} />
          </Link>
        </div>
        <div className='modal-body smart-form'>
          <div className='form-item'>
            <div className='item-label'><input type='checkbox' /></div>
            <div className='item-content'><span className='form-title'>{task.title}</span></div>
          </div>
          <div className='form-item'>
            <div className='item-label'></div>
            <div className='item-content'>
              <a href='#' onClick={this.selectMember}><i className='glyphicon glyphicon-user' /> {assignee.name}</a>
            </div>
            <div className='item-content'>
              <i className='glyphicon glyphicon-calendar' /> {task.dueDate ? moment(task.dueDate).format('L') : '截止日期'}
            </div>
          </div>
          <div className='form-item'>
            <div className='item-label'></div>
            <div className='item-content'><span>{task.desciption || '添加描述'}</span></div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default TaskDetail;