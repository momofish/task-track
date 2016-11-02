import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import { select } from '../utils';
import { Icon, IconText, Button, GroupButton, PopBox, GroupList } from './common';
import TaskDetail from './TaskDetail';
import workloadService from '../services/workloadService';

const WEEKDAYS = '日一二三四五六';
const APPROVE_STATUS_CLASS = { 0: 'text-info', 1: 'text-warning', 2: 'text-success', 3: 'text-danger' };
const APPROVE_STATUS_NAME = { 0: '填报中', 1: '审核中', 2: '已通过', 3: '已拒绝' };

export default class Workload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0, date: new Date(), selectedTask: null, todos: {}, filled: false,
      worksheet: {
        needWorkloads: {}, otherWorkloads: {}, tasks: [], workloads: {}
      },
      processing: false
    };
  }

  componentDidMount() {
    this.loadData();
    this.loadTodos();
  }

  async loadTodos() {
    let todos = await workloadService.getTodos();
    this.setState({ todos });
  }

  async loadData() {
    let {mode, date} = this.state;
    let worksheet = await workloadService.getWorkSheet(mode, date);
    this.state.worksheet = worksheet;
    this.state.filled = false;

    this.makeTotal();
    this.forceUpdate();
  }

  makeTotal() {
    let {worksheet} = this.state;
    let {workloads} = worksheet;
    let {needWorkloads, otherWorkloads} = worksheet;
    let totalWorkloads = _.mapValues(needWorkloads, v => 0);
    for (let taskId in workloads) {
      let workloadsByDate = workloads[taskId];
      for (let d in workloadsByDate) {
        totalWorkloads[d] += (workloadsByDate[d] || {}).workload * 1 || 0;
      }
    }
    for (let d in otherWorkloads) {
      totalWorkloads[d] += otherWorkloads[d] * 1;
    }
    totalWorkloads = _.mapValues(totalWorkloads, v => Math.round(v * 100) / 100)
    this.state.worksheet.totalWorkloads = totalWorkloads;
  }

  changeMode(button) {
    let {mode} = button;
    this.state.mode = mode;
    this.loadData();
  }

  changeDate(button, event) {
    let {date, mode} = this.state
    if (button.direction) {
      this.state.date = moment(date).add(button.direction, mode == 1 ? 'Month' : 'Week');
      this.loadData();
    }
    else
      select.selectDate(event.currentTarget, moment(date), date => {
        this.state.date = date;
        this.loadData();
      });
  }

  selectTask(selectedTask, event) {
    this.setState({ selectedTask });
    event.stopPropagation();
  }

  changeWorkload(task, day, event) {
    let filled = event.target.value;
    let {workloads} = this.state.worksheet;
    let workloadsByTask = workloads[task._id] = workloads[task._id] || {};
    let workload = workloadsByTask[day] = workloadsByTask[day] || {};

    workload.workload = filled;
    workload.status = 0;

    this.makeTotal();
    this.state.filled = true;
    this.forceUpdate();
  }

  autoFill() {
    let {worksheet} = this.state;
    let {workloads, needWorkloads, otherWorkloads, tasks} = worksheet;

    // 自动按天填充未填的工作量
    for (let day in needWorkloads) {
      let need = needWorkloads[day];
      if (!need) continue;
      let currentTasks = tasks.filter(task =>
        day >= moment(task.startDate || '1900-01-01').format('YYYY-MM-DD')
        && day <= moment(task.endDate || '2099-01-01').format('YYYY-MM-DD'));
      let other = otherWorkloads[day] || 0;
      let currentWorkloads = [];
      currentTasks.forEach(task => {
        let workloadsByTask = workloads[task._id] = workloads[task._id] || {};
        let workload = workloadsByTask[day] = workloadsByTask[day] || {};
        currentWorkloads.push(workload);
      });
      // 已填未填的分成两组
      let pair = _.groupBy(currentWorkloads, workload => workload.status >= 0 && workload.status <= 2);
      // 没有可填的就不管了
      if (!pair[false] || !pair[false].length) continue;
      let sumY = (pair[true] || []).reduce((pre, cur) => pre + (cur.workload || 0), 0);
      // 待填数
      let toFill = need - other - sumY;
      if (toFill <= 0) continue;
      let toFillPair = pair[false];
      let toFillAverage = Math.round(toFill / toFillPair.length * 100) / 100;
      let delta = Math.round((toFill - toFillAverage * toFillPair.length) * 100) / 100;
      toFillPair.forEach(workload => {
        workload.workload = toFillAverage;
        workload.status = 0;
      });
      toFillPair[0].workload = Math.round((toFillPair[0].workload + delta) * 100) / 100;
    }

    this.makeTotal();
    this.state.filled = true;
    this.forceUpdate();
  }

  async submit() {
    let {mode, date, worksheet, filled} = this.state;
    let {workloads, needWorkloads, totalWorkloads} = worksheet;

    if (_.chain(totalWorkloads).toPairs().some(pair => pair[1] > needWorkloads[pair[0]]).value()) {
      alert('超过工作量填报限制');
      return;
    }
    if (_.chain(totalWorkloads).toPairs().some(pair => isNaN(pair[1])).value()) {
      alert('无效工作量');
      return;
    }

    if (!filled) {
      alert('请填报工作量后提交');
      return;
    }

    if (!confirm('确定提交'))
      return false;

    this.setState({ processing: true });
    try {
      await workloadService.submitWorkSheet(mode, date, workloads);
    }
    finally {
      this.setState({ processing: false });
    }
    this.loadData();
  }

  selectApprove(event) {
    PopBox.open({
      target: event.currentTarget,
      align: 'right',
      style: { width: 600 },
      onClose: () => { this.loadData(); this.loadTodos(); },
      content: <WorkloadApprove />
    });
  }

  render() {
    let {mode, date, worksheet, selectedTask, todos, processing} = this.state;
    let {workloads} = worksheet;
    let {needWorkloads, otherWorkloads, tasks, totalWorkloads} = worksheet;
    let needWorkloadsPair = _.toPairs(needWorkloads);

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <Icon icon='lock' /> 填工作量
          </h2>
          <div className="btn-group pull-right" onClick={this.selectApprove.bind(this)}>
            <button type="button" className="btn btn-info">
              <span className="glyphicon glyphicon-list-alt" />
            </button>
            <button type="button" className="btn btn-default" style={{ width: 180 }}>
              待审批 <span className="badge">{!!todos.approve && todos.approve}</span> <i className="caret" />
            </button>
          </div>
        </div>
        <nav className='navbar navbar-default'>
          <form className='navbar-form' role='search'>
            <Button text='提交' disabled={processing} className='btn-primary' onClick={this.submit.bind(this)} />&nbsp;
            <GroupButton data={[
              { text: '按周', className: mode == 0 && 'active', mode: 0 },
              { text: '按月', className: mode == 1 && 'active', mode: 1 }
            ]} onClick={this.changeMode.bind(this)} />&nbsp;
            <GroupButton data={[
              { icon: 'chevron-left', direction: -1 },
              {
                text: date ? moment(date).format('MM/DD') : '日期',
                icon: 'calendar'
              },
              { icon: 'chevron-right', direction: 1 }
            ]} onClick={this.changeDate.bind(this)} />&nbsp;
            <Button text='一键填报' className='btn-info' onClick={this.autoFill.bind(this)} />
          </form>
        </nav>
        <div className='flex flex-hscroll'>
          <div className='scroll-container'>
            <table className="text-sm table table-bordered table-striped table-condensed">
              <thead>
                <tr>
                  <th style={{ width: 150 }}>任务</th>
                  <th style={{ width: 60 }}>开始</th>
                  <th style={{ width: 60 }}>结束</th>
                  {needWorkloadsPair.map(need => <th key={need[0]} style={{ width: 30 }}>
                    {`${WEEKDAYS[moment(need[0]).weekday()]} ${moment(need[0]).format('MM/DD')}`}
                  </th>)}
                </tr>
              </thead>
              <tbody>
                <tr className='info'>
                  <td>应填报</td>
                  <td></td>
                  <td></td>
                  {needWorkloadsPair.map(need => <td key={need[0]}>{need[1]}</td>)}
                </tr>
                {tasks.map(task => {
                  let workloadsByDate = workloads[task._id] || {};
                  return (
                    <tr key={task._id}>
                      <td className='nowrap'>
                        <IconText onClick={this.selectTask.bind(this, task)}>
                          {`[${task.project.id || '无编号'}-${task.project.name}]${task.title}`}
                        </IconText>
                      </td>
                      <td>{task.startDate && moment(task.startDate).format('MM/DD')}</td>
                      <td>{task.endDate && moment(task.endDate).format('MM/DD')}</td>
                      {needWorkloadsPair.map(pair => {
                        let day = pair[0];
                        let workload = workloadsByDate[day] || {};
                        return (
                          <td key={day}>
                            <input disabled={!task.project.id || !needWorkloads[day] || moment(day) < moment(task.startDate || '1900-01-01') || moment(day) > moment(task.endDate || '2099-01-01')}
                              title={workload.status && `[${APPROVE_STATUS_NAME[workload.status]}]${workload.opinion || ''}`}
                              className={`form-control input-sm ${APPROVE_STATUS_CLASS[workload.status]}`}
                              onChange={this.changeWorkload.bind(this, task, day)}
                              value={workload.workload} />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
                <tr>
                  <td>其它已填</td>
                  <td></td>
                  <td></td>
                  {needWorkloadsPair.map(pair => <td key={pair[0]}>{otherWorkloads[pair[0]]}</td>)}
                </tr>
                <tr className='info'>
                  <td>合计</td>
                  <td></td>
                  <td></td>
                  {_.toPairs(totalWorkloads).map((pair, i) => {
                    let day = pair[0], workload = pair[1], need = needWorkloadsPair[i][1];
                    return <td key={day}
                      className={workload > need ? 'text-danger' : workload < need ? 'text-warning' : 'text-success'}>
                      {need > 0 && workload}
                    </td>
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          this.setState({ selectedTask: null });
          updated && this.loadData();
        } } />}
      </div>
    );
  }
}

class WorkloadApprove extends Component {
  constructor(props) {
    super(props);
    this.state = { approveGroups: [], workloads: null, selectedTask: null, processing: false };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let approves = await workloadService.getTodos('approve');
    let approveGroups = _.chain(approves)
      .groupBy(workload => `[${workload.project.name}]${workload.owner.name}`).toPairs()
      .map(pair => ({
        header: { label: pair[0] },
        body: pair[1].map(workload => {
          workload.checked = true;
          return ({
            label: workload.task.title, data: workload, checked: true,
            tags: [
              { label: moment(workload.date).format('L') },
              { label: workload.workload, style: 'danger' },
            ]
          });
        })
      }))
      .value();
    this.setState({ approveGroups, approves });
  }

  async approve(agree) {
    let {approves, opinion} = this.state;
    approves = approves.filter(approve => approve.checked).map(approve => approve._id);
    if (!approves.length) {
      alert('请选择待审批项');
      return;
    }
    this.setState({ processing: true });
    try {
      await workloadService.approve(approves, agree, opinion);
    }
    finally {
      this.setState({ processing: false });
    }
    await this.loadData();
    if (!this.state.approves.length)
      PopBox.close();
  }

  check(item) {
    item.checked = !item.checked;
    item.data.checked = item.checked;
    this.forceUpdate();
  }

  select(workload) {
    this.setState({ selectedTask: workload.task });
  }

  render() {
    let {approveGroups, selectedTask, opinion, processing} = this.state;
    return (
      <div className='container-fluid' style={{ paddingTop: 20 }}>
        <nav className='navbar navbar-default'>
          <form className='navbar-form' role='search'>
            <input value={opinion} className='form-control' placeholder='审批意见' onChange={event => this.state.opinion = event.target.value} />&nbsp;
            <Button disabled={processing} text='同意' className='btn-sm btn-success' onClick={this.approve.bind(this, true)} />&nbsp;
            <Button disabled={processing} text='不同意' className='btn-sm btn-danger' onClick={this.approve.bind(this, false)} />&nbsp;
          </form>
        </nav>
        {approveGroups.length ?
          <GroupList data={approveGroups} style={{ maxHeight: 600 }}
            onCheck={this.check.bind(this)}
            onSelect={this.select.bind(this)}
            /> : <div className="alert alert-info">无待审批项</div>}
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          this.setState({ selectedTask: null });
        } } />}
      </div>
    );
  }
}