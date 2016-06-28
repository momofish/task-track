import React, {Component} from 'react';
import {GroupList, PadList, QuickAdd} from './common';
import MyTaskStore from '../stores/MyTaskStore';
import Actions from '../actions/MyTaskActions';
import TaskDetail from './TaskDetail';
import {select} from '../utils';
import {taskTreat} from '../models';

const selectors = [{
  key: 'project',
  idGetter: project => project._id,
  nameGetter: project => project.name,
  type: 'selectProject', label: '选择项目'
}];

class MyTask extends Component {
  constructor(props) {
    super(props);
    this.state = MyTaskStore.getState();

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MyTaskStore.listen(this.onChange);
    Actions.getTasks(this.props.params.category);
  }

  componentWillUnmount() {
    MyTaskStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    Actions.getTasks(nextProps.params.category || 'my',
      this.state.filter.query);
  }

  onChange(state) {
    this.setState(state);
  }

  addTask(quick, form) {
    let task = { title: quick.title };
    selectors.forEach(selector => task[selector.key] = quick[selector.key] && selector.idGetter(quick[selector.key]));
    Actions.addTask(task, form);
  }

  selectTask(task, event) {
    Actions.selectTask(task);
  }

  checkTask(item, event) {
    let task = item.data;
    Actions.updateTaskDetail({ _id: task._id, completed: !task.completed });
  }

  clickTag(task, tag, event) {
    event.stopPropagation();
    if (tag.code === 'treat') {
      select.selectMenu(event.currentTarget, tag.data, treat => {
        Actions.updateTaskDetail({ _id: task._id, treat: treat.key });
      }, { align: 'right', data: taskTreat });
    }
    else if (tag.code === 'project') {
      this.props.history.pushState(null, `/tasks/projects/${tag.data._id}`);
    }
    else if (tag.code === 'dueDate') {
      select.selectDate(event.currentTarget, tag.data, dueDate => {
        Actions.updateTaskDetail({ _id: task._id, dueDate });
      }, { align: 'right' });
    }
  }

  selectFilter(event) {
    Actions.selectFilter(event.currentTarget, this.state.filter);
  }

  quickAddSelect(event) {
    let quickAdd = this.state.quickAdd;
    select.selectProject(event.currentTarget, quickAdd.project, project => {
    }, { align: 'right' });
  }

  render() {
    let {selectedTask, filter, quickAdd, taskGroups} = this.state;
    let isPart = this.props.params.category == 'part';
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> {`我${isPart ? '参与' : ''}的任务`} <span className="badge">{this.state.tasks.length}</span>
          </h2>
          <div className="btn-group pull-right" onClick={this.selectFilter.bind(this) }>
            <button type="button" className="btn btn-info" disabled>
              <span className="glyphicon glyphicon-list-alt" />
            </button>
            <button type="button" className="btn btn-default" style={{ width: 180 }}>
              {filter.name} <i className="caret" />
            </button>
          </div>
        </div>
        {!isPart && <QuickAdd data={quickAdd} placeHolder='快速添加新任务' onSubmit={this.addTask.bind(this) } selectors={selectors} />}
        {filter.mode == 'pad' ?
          <PadList  data={taskGroups} onSelect={this.selectTask} onClickTag={this.clickTag.bind(this) } /> :
          <GroupList data={taskGroups}
            onSelect={this.selectTask}
            onClickTag={this.clickTag.bind(this) }
            onCheck={this.checkTask.bind(this)} />
        }
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          Actions.selectTask();
          updated && Actions.getTasks();
        } } />}
      </div>
    );
  }
}

export default MyTask;