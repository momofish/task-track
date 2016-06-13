import React, {Component} from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import {extend} from 'underscore';
import classnames from 'classnames';
import {Modal, PopBox, FormItem, Selector, EditableText, SelectableText, Icon} from './common';
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
    if (!task.project) {
      toastr.error('请先选择项目');
      return;
    }
    select.selectMember(event.currentTarget, selected, selecting => {
      let newTask = { _id: task._id };
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
    let project = task.project || { name: '未分配项目' };
    let owner = task.owner || { name: '未分配人员' };
    let completed = task.completed;
    let className = classnames('form-title', { completed });
    return (
      <Modal onHidden={this.dismiss}
        header={<Link to={`/tasks/projects/${project._id}`}
          onClick={(event) => { if (!project.id) { event.preventDefault(); this.selectProject(event) } } }>
          {project.name}&nbsp;
          <i className='glyphicon glyphicon-menu-down' onClick={this.selectProject} />
        </Link>}
        body={
          <div className='smart-form'>
            <FormItem
              label={<div className='form-title'>
                <input type='checkbox' checked={completed} onChange={this.completeTask} />
              </div>}
              content={<EditableText className={className} text={task.title}
                onChange={(text) => this.updateTaskDetail({ title: text }) } />}
              />
            <FormItem content={[
              <SelectableText icon='user' text={owner.name}
                onClick={this.selectMember.bind(this, task.owner, 'owner') } />,
              <SelectableText text={task.dueDate ? moment(task.dueDate).format('L') : '截止日期'}
                icon='calendar' onClick={this.selectDueDate}
                />
            ]} />
            <FormItem content={<EditableText multiline='true' text={task.description} placeholder='添加描述'
              onChange={(text) => this.updateTaskDetail({ description: text }) } />} />
            <FormItem label='参与' content={
              <div>
                {task.members.map((member, i) =>
                  <SelectableText key={i} icon='user' text={member.name} />
                ) }
                <SelectableText icon='plus' onClick={this.selectMember.bind(this, task.members, 'members') } />
              </div>} />
          </div>}>
      </Modal>
    );
  }
}

export default TaskDetail;