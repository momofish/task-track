import React, { Component } from 'react';
import { assign } from 'lodash';

import { Modal } from './common';
import { Icon, IconText, Button, GroupButton, PopBox, GroupList } from './common';
import ProjectSetting from './ProjectSetting';
import { projectService } from '../services';
import { select } from '../utils';

export default class MyProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let projects = await projectService.getManagedProjects();
    this.setState({ projects });
  }

  selectProject(project) {
    let state = {};

    let modalOptions = {
      onHidden: () => {
        if (state.updated)
          this.loadData();
      }
    };

    assign(modalOptions, {
      header: '项目设置',
      body: <ProjectSetting project={project} state={state} />
    });

    Modal.open(modalOptions);
  }

  changeOwner(project, event) {
    select.select4ProjectMember(event.currentTarget, project.owner, selecting => {
      project.owner = selecting;
      projectService.saveProject(project);
      this.loadData();
    }, project);
  }

  render() {
    let { projects } = this.state;

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <Icon icon='lock' /> 我管理的项目
          </h2>
        </div>
        <table className="text-sm table table-bordered table-striped table-condensed">
          <thead>
            <tr>
              <th style={{ width: 100 }}>项目编号</th>
              <th style={{ minWidth: 200 }}>项目名称</th>
              <th style={{ width: 100 }}>所有者</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) =>
              <tr key={i}>
                <td>
                  <IconText onClick={this.selectProject.bind(this, project)}>{project.id}</IconText>
                </td>
                <td>{project.name}</td>
                <td>
                  <IconText icon='user' text={project.owner.name}
                    onClick={this.changeOwner.bind(this, project)} />
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}