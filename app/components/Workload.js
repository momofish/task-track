import React, {Component} from 'react';
import {Icon, Button, GroupButton} from './common';
import moment from 'moment';
import workloadService from '../services/workloadService';

class Workload extends Component {
  constructor(props) {
    super(props);
    this.state = { mode: 0, date: new Date(), workSheet: null };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let {mode, date} = this.state;
    let workSheet = await workloadService.getWorkSheet(mode, date);
    this.setState({ workSheet });
  }

  changeMode(button) {
    let {mode} = button;
    this.setState({ mode });
  }

  render() {
    let {mode, date} = this.state;

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
          <table className="table table-bordered table-striped table-condensed table-hover">
            <thead>
              <tr>
                <th style={{ width: 100 }}>任务</th>
                <th style={{ width: 60 }}>开始</th>
                <th style={{ width: 60 }}>结束</th>
                <th style={{ width: 40 }}>一 9/19</th>
              </tr>
            </thead>
            <tbody>
              <tr className='warning'>
                <td>总量</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>任务1</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Workload;