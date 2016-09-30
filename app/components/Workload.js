import React, {Component} from 'react';
import {Icon, Button, GroupButton} from './common';
import TaskDetail from './TaskDetail';
import moment from 'moment';
import _ from 'underscore';
import workloadService from '../services/workloadService';

class Workload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0, date: new Date(), selectedTask: null,
      worksheet: {
        needWorkloads: {}, otherWorkloads: {}, tasks: []
      }
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let {mode, date} = this.state;
    let worksheet = await workloadService.getWorkSheet(mode, date);
    this.setState({ worksheet });
  }

  changeMode(button) {
    let {mode} = button;
    this.setState({ mode });
  }

  selectTask(selectedTask, event) {
    this.setState({selectedTask});
    event.stopPropagation();
  }

  render() {
    let {mode, date, worksheet, selectedTask} = this.state;
    let {needWorkloads, otherWorkloads, tasks} = worksheet;
    let needWorkloadsPair = _.pairs(needWorkloads);

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <Icon icon='lock' /> 填工作量
          </h2>
        </div>
        <nav className='navbar navbar-default'>
          <form className='navbar-form' role='search'>
            <Button text='提交' className='btn-primary' />&nbsp;
            <GroupButton data={[
              { text: '按周', className: mode == 0 && 'active', mode: 0 },
              { text: '按月', className: mode == 1 && 'active', mode: 1 }
            ]} onClick={this.changeMode.bind(this) } />&nbsp;
            <GroupButton data={[{ icon: 'chevron-left' }, { text: date ? moment(date).format('L') : '日期', icon: 'calendar' }, { icon: 'chevron-right' }]} />&nbsp;
            <Button text='一键填报' className='btn-info' />
          </form>
        </nav>
        <div className="table-responsive">
          <table className="text-sm table table-bordered table-striped table-condensed table-hover">
            <thead>
              <tr>
                <th style={{ width: 100 }}>任务</th>
                <th style={{ width: 60 }}>开始</th>
                <th style={{ width: 60 }}>结束</th>
                {needWorkloadsPair.map(need => <th key={need[0]} style={{ width: 40 }}>{moment(need[0]).format('MM/DD') }</th>) }
              </tr>
            </thead>
            <tbody>
              <tr className='warning'>
                <td>总量</td>
                <td></td>
                <td></td>
                {needWorkloadsPair.map(need => <td key={need[0]}>{need[1]}</td>) }
              </tr>
              {tasks.map(task =>
                <tr key={task._id}>
                  <td><a href='' onClick={this.selectTask.bind(this, task)}>{`[${task.project.id || '无编号'}-${task.project.name}]${task.title}`}</a></td>
                  <td>{moment(task.startDate).format('L') }</td>
                  <td>{moment(task.endDate).format('L') }</td>
                  {needWorkloadsPair.map(need => <td key={need[0]}></td>) }
                </tr>
              ) }
            </tbody>
          </table>
        </div>
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          this.setState({selectedTask: null});
          updated && this.loadData();
        } } />}
      </div>
    );
  }
}

export default Workload;