import React, {Component} from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import {extend} from 'underscore';
import classnames from 'classnames';
import {Modal, PopBox, FormItem,
  Selector, EditableText, IconText, Icon,
  ListItem, QuickAdd, Progress} from './common';
import Store from '../stores/TaskDetailStore';
import Actions from '../actions/TaskDetailActions';
import {projectService} from '../services';
import {select} from '../utils';

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = Store.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
    Actions.getTask(this.props.task._id);
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  dismiss() {
    this.props.onHidden(this.state.updated);
  }

  updateTask(task) {
    Actions.updateTask(task, task);
  }

  completeTask(event) {
    let task = this.state.task;
    task.completed = event.currentTarget.checked;
    Actions.updateTask({
      _id: task._id, completed: task.completed
    });
  }

  selectProject(event) {
    event.preventDefault();
    let task = this.state.task;
    select.selectProject(event.currentTarget, task.project, (project) => {
      Actions.updateTask({
        _id: task._id, project: project._id
      }, { project });
    });
  }

  selectMember(selected, field, event) {
    let {task} = this.state;
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
      Actions.updateTask(newTask, populated);
    }, { _id: task.project && task.project._id });
  }

  selectDueDate(event) {
    let task = this.state.task
    select.selectDate(event.currentTarget, moment(task.dueDate), date => {
      Actions.updateTask({
        _id: task._id, dueDate: date.toString()
      }, { dueDate: date });
    });
  }

  selectMenu(event) {
    select.selectMenu(event.currentTarget, null, selecting => {
      let {task} = this.state;
      if (selecting.code == 'delete') {
        Actions.deleteTask({id: task._id, component: this});
      }
    }, { data: [{ code: 'delete', name: '删除任务', icon: 'trash' }] });
  }

  addSubTask(quick) {
    let {task} = this.state;
    let newTask = { _id: task._id, subTasks: task.subTasks };
    newTask.subTasks.push({ name: quick.title });
    this.updateTask(newTask);
  }

  editSubTask(updator, input) {
    let {task} = this.state;

    updator(input);
    this.updateTask(task);
  }

  render() {
    let task = this.state.task || this.props.task;
    let project = task.project || { name: '未分配项目' };
    let owner = task.owner || { name: '未分配人员' };
    let {completed, subTasks} = task;
    let className = classnames('form-title', { completed });
    let completeRatio = subTasks.filter(subTask => subTask.completed).length / (subTasks.length + 1e-18);

    return (
      <Modal ref='modal' onHidden={this.dismiss.bind(this) }
        header={<div className='flex flex-horizontal'>
          <Link to={`/tasks/projects/${project._id}`}
            onClick={this.selectProject.bind(this) }>
            {project.name}&nbsp;
            <Icon className='glyphicon glyphicon-menu-down' onClick={this.selectProject.bind(this) } />
          </Link>
          <div className='flex flex-end modal-header-content'>
            <IconText icon='option-vertical' iconClassName='circle' tooltip='更多'
              onClick={this.selectMenu.bind(this) } />
          </div>
        </div>}
        body={
          <div className='smart-form'>
            <FormItem
              label={<div className='form-title'>
                <input type='checkbox' checked={completed} onChange={this.completeTask.bind(this) } />
              </div>}>
              <EditableText className={className} value={task.title}
                onChange={text => this.updateTask({ _id: task._id, title: text.value }) } />
            </FormItem>
            <FormItem content={[
              <IconText icon='user' text={owner.name}
                onClick={this.selectMember.bind(this, task.owner, 'owner') } />,
              <IconText text={task.dueDate ? moment(task.dueDate).format('L') : '截止日期'}
                icon='calendar' onClick={this.selectDueDate.bind(this) }
                />
            ]} />
            <FormItem>
              <EditableText multiline='true' value={task.description} placeholder='添加描述'
                onChange={text => this.updateTask({ _id: task._id, description: text.value }) } />
            </FormItem>
            <FormItem label='参与'>
              <div>
                {task.members.map((member, i) =>
                  <IconText key={i} icon='user' text={member.name} />
                ) }
                <IconText icon='plus' onClick={this.selectMember.bind(this, task.members, 'members') } />
              </div>
            </FormItem>
            {task.subTasks &&
              <FormItem label='检查点'>
                <div className='well-wrap'>
                  <Progress bar={{ type: 'success', ratio: completeRatio }} />
                  <ul>
                    {task.subTasks.map((subTask, i) =>
                      <ListItem key={i} className='list-item flex' item={{
                        label: <EditableText value={subTask.name}
                          onChange={this.editSubTask.bind(this, text => subTask.name = text.value) } />,
                        checked: subTask.completed, completed: subTask.completed
                      }} onCheck={this.editSubTask.bind(this, () => subTask.completed = !subTask.completed) } />
                    ) }
                  </ul>
                  <QuickAdd placeHolder='添加检查点' onSubmit={this.addSubTask.bind(this) } />
                </div>
              </FormItem>}
          </div>}>
      </Modal>
    );
  }
}

export default TaskDetail;