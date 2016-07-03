import React, { Component } from 'react'
import {Modal, FormItem, IconText} from './common';
import {projectService} from '../services';
import {select} from '../utils';

class ProjectSetting extends Component {
  constructor(props) {
    super(props);
    this.state = { project: props.project || {members: []} };
  }

  componentDidMount() {
    let project = this.props.project;
    if (project)
      projectService.getProject(project._id)
        .then(project => this.setState({ project }));
  }

  dismiss(event) {
    Modal.close();
  }

  changeEntity(entity, field, event) {
    entity[field] = event.target.value;
    this.forceUpdate();
  }

  saveEntity(entity) {
    this.props.state.updated = true;
    projectService.saveProject(entity)
      .then(this.dismiss);
  }

  handleSubmit(project, event) {
    event.preventDefault();
    this.saveEntity(project);
  }

  selectTeam(event) {
    let project = this.state.project;

    select.selectTeam(event.currentTarget, project.team, selecting => {
      project.team = selecting;
      this.forceUpdate();
    })
  }

  selectUser(field, event) {
    let project = this.state.project;
    let selected = project[field];
    select.selectUser(event.currentTarget, selected, selecting => {
      project[field] = selecting;
      this.forceUpdate();
    });
  }

  render() {
    let project = this.state.project;
    let owner = project.owner || { name: '无所有者' };
    let members = project.members || [];
    let team = project.team || { name: '未指派团队' };

    return (
      <form className='smart-form' onSubmit={this.handleSubmit.bind(this, project) }>
        <FormItem label='名称'>
          <input type='text' className='form-control'
            value={project.name} onChange={this.changeEntity.bind(this, project, 'name') } />
        </FormItem>
        <FormItem>
          <IconText icon='user' text={owner.name}
            onClick={this.selectUser.bind(this, 'owner') } />
        </FormItem>
        <FormItem label='团队'>
          <IconText icon='th-large' text={team.name}
            onClick={this.selectTeam.bind(this) } />
        </FormItem>
        <FormItem label='成员'>
          <div>
            {members.map((member, i) =>
              <IconText key={i} icon='user' text={member.name} />
            ) }
            <IconText icon='plus'
              onClick={this.selectUser.bind(this, 'members') } />
          </div>
        </FormItem>
        <FormItem>
          <div>
            <button type='submit' className='btn btn-primary btn-sm'>确定</button>
            <button type='button' className='btn btn-link btn-sm' onClick={this.dismiss}>取消</button>
          </div>
        </FormItem>
      </form>
    )
  }
}

export default ProjectSetting
