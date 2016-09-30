import React, {Component} from 'react';
import moment from 'moment';
import _ from 'underscore';

import {select} from '../utils';
import {Icon, IconText, Button, GroupButton} from './common';
import TaskDetail from './TaskDetail';
import workloadService from '../services/workloadService';

const WEEKDAYS = '日一二三四五六';

class Workload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0, date: new Date(), selectedTask: null,
      worksheet: {
        needWorkloads: {}, otherWorkloads: {}, tasks: []
      },
      workloads: {}
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
    this.loadData();
  }

  changeDate(event) {
    let {date} = this.state
    select.selectDate(event.currentTarget, moment(date), date => {
      this.setState({ date });
      this.loadData();
    });
  }

  selectTask(selectedTask, event) {
    this.setState({ selectedTask });
    event.stopPropagation();
  }

  changeWorkload(task, date, event) {
    let {workloads} = this.state;

    let filled = event.target.value;
    let workloadsByTask = workloads[task._id] = workloads[task._id] || {};
    workloadsByTask[date] = filled;
    this.setState({ workloads });
  }

  render() {
    let {mode, date, worksheet, selectedTask, workloads} = this.state;
    let {needWorkloads, otherWorkloads, tasks} = worksheet;
    let needWorkloadsPair = _.pairs(needWorkloads);
    let totalWorkloads = _.mapObject(needWorkloads, (v, k) => 0);
    for (let taskId in workloads) {
      let workloadsByDate = workloads[taskId];
      for (let d in workloadsByDate) {
        totalWorkloads[d] += workloadsByDate[d] * 1;
      }
    }
    for (let d in otherWorkloads) {
      totalWorkloads[d] += otherWorkloads[d] * 1;
    }

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
            <GroupButton data={[
              { icon: 'chevron-left' },
              { text: date ? moment(date).format('L') : '日期', icon: 'calendar', onClick: this.changeDate.bind(this) },
              { icon: 'chevron-right' }
            ]} />&nbsp;
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
                {needWorkloadsPair.map(need => <th key={need[0]} style={{ width: 40 }}>{`${WEEKDAYS[moment(need[0]).weekday()]} ${moment(need[0]).format('MM/DD')}` }</th>) }
              </tr>
            </thead>
            <tbody>
              <tr className='info'>
                <td>总量</td>
                <td></td>
                <td></td>
                {needWorkloadsPair.map(need => <td key={need[0]}>{need[1]}</td>) }
              </tr>
              <tr className='warning'>
                <td>其它</td>
                <td></td>
                <td></td>
                {needWorkloadsPair.map(need => <td key={need[0]}>{otherWorkloads[need[0]]}</td>) }
              </tr>
              {tasks.map(task => {
                let workloadsByTask = workloads[task.id];
                return (
                  <tr key={task._id}>
                    <td className='nowrap'>
                      <IconText onClick={this.selectTask.bind(this, task) }>
                        {`[${task.project.id || '无编号'}-${task.project.name}]${task.title}`}
                      </IconText>
                    </td>
                    <td>{moment(task.startDate).format('MM/DD') }</td>
                    <td>{moment(task.endDate).format('MM/DD') }</td>
                    {needWorkloadsPair.map(need => <td key={need[0]}>
                      <input type='text' disabled={!task.project.id || !needWorkloads[need[0]]} className='form-control input-sm'
                        onChange={this.changeWorkload.bind(this, task, need[0]) }
                        value={(workloadsByTask || {})[need[0]]} />
                    </td>) }
                  </tr>
                )
              }) }
              <tr className='warning'>
                <td>合计</td>
                <td></td>
                <td></td>
                {_.pairs(totalWorkloads).map(workload => <td key={workload[0]}>{workload[1]}</td>) }
              </tr>
            </tbody>
          </table>
        </div>
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          this.setState({ selectedTask: null });
          updated && this.loadData();
        } } />}
      </div>
    );
  }
}

export default Workload;