import React, {Component} from 'react';
import {Link} from 'react-router';
import {assign} from 'lodash';

import Sidebar from './Sidebar';
import {Modal} from './common';
import ProjectSetting from './ProjectSetting';
import TeamSetting from './TeamSetting';
import TasksStore from '../stores/TasksStore'
import TasksActions from '../actions/TasksActions';
import {select} from '../utils';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = TasksStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    TasksStore.listen(this.onChange);

    TasksActions.getProjects(openModal);
  }

  componentWillUnmount() {
    TasksStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleAdd(event) {
    select.selectMenu(event.currentTarget, null,
      selecting => {
        openModal(selecting.code);
      }, {
        align: 'right',
        style: { width: 120 },
        data: [
          { code: 'project', name: '项目' },
          { code: 'team', name: '团队' }
        ]
      });
  }

  render() {
    return (
      <div className='main-container'>
        <Sidebar data={this.state.sidebar} onAdd={this.handleAdd.bind(this) } />
        <div className='main-content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

function openModal(code, object) {
  let state = {};
  let modalOptions = {
    onHidden: () => {
      state.updated && TasksActions.getProjects(openModal);
      state.updated = false;
    }
  };
  if (code == 'team')
    assign(modalOptions, {
      header: '团队设置',
      body: <TeamSetting team={object} state={state} />
    });
  else if (code == 'project')
    assign(modalOptions, {
      header: '项目设置',
      body: <ProjectSetting project={object} state={state} />
    });

  Modal.open(modalOptions);
}

export default Tasks;