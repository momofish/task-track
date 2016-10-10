import React, {Component} from 'react';
import moment from 'moment';
import _ from 'lodash';

import {select} from '../utils';
import {Icon, IconText, Button, GroupButton, PopBox, GroupList} from './common';
import TaskDetail from './TaskDetail';
import workloadService from '../services/workloadService';

const WEEKDAYS = '日一二三四五六';
const APPROVE_STATUS_CLASS = { 0: 'text-info', 1: 'text-warning', 2: 'text-success', 3: 'text-danger' };
const APPROVE_STATUS_NAME = { 0: '填报中', 1: '审核中', 2: '已通过', 3: '已拒绝' };

export default class Workload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0, date: new Date(), selectedTask: null, todos: {},
      worksheet: {
        needWorkloads: {}, otherWorkloads: {}, tasks: [], workloads: {}
      }
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
    this.makeTotal();

    this.forceUpdate();
  }

  makeTotal() {
    let {worksheet} = this.state;
    let {workloads} = worksheet;
    let {needWorkloads, otherWorkloads} = worksheet;
    let totalWorkloads = _.mapValues(needWorkloads, (v, k) => 0);
    for (let taskId in workloads) {
      let workloadsByDate = workloads[taskId];
      for (let d in workloadsByDate) {
        totalWorkloads[d] += (workloadsByDate[d] || {}).workload * 1;
      }
    }
    for (let d in otherWorkloads) {
      totalWorkloads[d] += otherWorkloads[d] * 1;
    }
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
    let {workloads} = this.state.worksheet;

    let filled = event.target.value;
    let workloadsByTask = workloads[task._id] = workloads[task._id] || {};
    let workload = workloadsByTask[day] = workloadsByTask[day] || {};
    workload.workload = filled;
    workload.status = 0;

    this.makeTotal();

    this.setState({ workloads });
  }

  async submit() {
    if (!confirm('确定提交'))
      return false;

    let {mode, date, worksheet} = this.state;
    let {workloads, needWorkloads, totalWorkloads} = worksheet;

    if (_.chain(totalWorkloads).toPairs().some(pair => pair[1] > needWorkloads[pair[0]]).value()) {
      alert('超过工作量填报限制');
      return;
    }

    await workloadService.submitWorkSheet(mode, date, workloads);
    this.loadData();
  }

  selectApprove(event) {
    PopBox.open({
      target: event.currentTarget,
      align: 'right',
      style: { width: 600 },
      onClose: () => this.loadData(),
      content: <WorkloadApprove />
    });
  }

  render() {
    let {mode, date, worksheet, selectedTask, todos} = this.state;
    let {workloads} = worksheet;
    let {needWorkloads, otherWorkloads, tasks, totalWorkloads} = worksheet;
    let needWorkloadsPair = _.toPairs(needWorkloads);

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <Icon icon='lock' /> 填工作量
          </h2>
          <div className="btn-group pull-right" onClick={this.selectApprove.bind(this) }>
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
            <Button text='提交' className='btn-primary' onClick={this.submit.bind(this) } />&nbsp;
            <GroupButton data={[
              { text: '按周', className: mode == 0 && 'active', mode: 0 },
              { text: '按月', className: mode == 1 && 'active', mode: 1 }
            ]} onClick={this.changeMode.bind(this) } />&nbsp;
            <GroupButton data={[
              { icon: 'chevron-left', direction: -1 },
              {
                text: date ? moment(date).format('MM/DD') : '日期',
                icon: 'calendar'
              },
              { icon: 'chevron-right', direction: 1 }
            ]} onClick={this.changeDate.bind(this) } />&nbsp;
            <Button text='一键填报' className='btn-info' />
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
                    {`${WEEKDAYS[moment(need[0]).weekday()]} ${moment(need[0]).format('MM/DD')}` }
                  </th>) }
                </tr>
              </thead>
              <tbody>
                <tr className='info'>
                  <td>应填报</td>
                  <td></td>
                  <td></td>
                  {needWorkloadsPair.map(need => <td key={need[0]}>{need[1]}</td>) }
                </tr>
                {tasks.map(task => {
                  let workloadsByDate = workloads[task._id] || {};
                  return (
                    <tr key={task._id}>
                      <td className='nowrap'>
                        <IconText onClick={this.selectTask.bind(this, task) }>
                          {`[${task.project.id || '无编号'}-${task.project.name}]${task.title}`}
                        </IconText>
                      </td>
                      <td>{moment(task.startDate).format('MM/DD') }</td>
                      <td>{moment(task.endDate).format('MM/DD') }</td>
                      {needWorkloadsPair.map(pair => {
                        let day = pair[0];
                        let workload = workloadsByDate[day] || {};
                        return (
                          <td key={day}>
                            <input disabled={!task.project.id || !needWorkloads[day]}
                              title={workload.status && `[${APPROVE_STATUS_NAME[workload.status]}]${workload.opinion || ''}`}
                              className={`form-control input-sm ${APPROVE_STATUS_CLASS[workload.status]}`}
                              onChange={this.changeWorkload.bind(this, task, day) }
                              value={workload.workload} />
                          </td>
                        )
                      }) }
                    </tr>
                  )
                }) }
                <tr>
                  <td>其它已填</td>
                  <td></td>
                  <td></td>
                  {needWorkloadsPair.map(pair => <td key={pair[0]}>{otherWorkloads[pair[0]]}</td>) }
                </tr>
                <tr className='warning'>
                  <td>合计</td>
                  <td></td>
                  <td></td>
                  {_.toPairs(totalWorkloads).map((pair, i) => {
                    let day = pair[0], workload = pair[1], need = needWorkloadsPair[i][1];
                    return <td key={day} className={workload > need ? 'text-danger' : workload == need && need ? 'text-success' : null}>{need>0 && workload}</td>
                  }) }
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
    this.state = { approveGroups: [], approves: null, selectedTask: null };
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
    await workloadService.approve(approves, agree, opinion);
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
    let {approveGroups, selectedTask, opinion} = this.state;
    return (
      <div className='container-fluid' style={{ paddingTop: 20 }}>
        <nav className='navbar navbar-default'>
          <form className='navbar-form' role='search'>
            <input value={opinion} className='form-control' placeholder='审批意见' onChange={event => this.state.opinion = event.value} />&nbsp;
            <Button text='同意' className='btn-sm btn-success' onClick={this.approve.bind(this, true) } />&nbsp;
            <Button text='不同意' className='btn-sm btn-danger' onClick={this.approve.bind(this, false) } />&nbsp;
          </form>
        </nav>
        <GroupList data={approveGroups} style={{ maxHeight: 600 }}
          onCheck={this.check.bind(this) }
          onSelect={this.select.bind(this) }
          />
        {selectedTask && <TaskDetail task={selectedTask} onHidden={updated => {
          this.setState({ selectedTask: null });
        } } />}
      </div>
    );
  }
}