import React, { Component } from 'react';

import { Modal, FormItem, IconText, ListItem, EditableText, QuickAdd } from './common';
import { projectService, workloadService, userService } from '../services';
import { select } from '../utils';

class ProjectSetting extends Component {
  constructor(props) {
    super(props);
    this.state = { project: props.project || { members: [] } };
    this.quick = { title: '' };
  }

  componentDidMount() {
    let { project } = this.props;

    if (project)
      projectService.getProject(project._id)
        .then(project => this.setState({ project }));
  }

  dismiss(event) {
    Modal.close();
  }

  changeEntity(field, event) {
    let { project } = this.state;
    project[field] = event.target.value;
    this.forceUpdate();
  }

  saveEntity() {
    let { project } = this.state;
    this.props.state.updated = true;
    projectService.saveProject(project)
      .then(this.dismiss);
  }

  async deleteProject() {
    if (!confirm('删除后将无法恢复，确认删除？'))
      return;
    
    let { project } = this.state;
    await projectService.deleteProject(project._id);

    this.props.state.updated = true;
    this.dismiss();
  }

  handleSubmit(event) {
    let { project } = this.state;
    event.preventDefault();
    this.saveEntity(project);
  }

  selectTeam(event) {
    let { project } = this.state;

    select.selectTeam(event.currentTarget, project.team, selecting => {
      project.team = selecting;
      this.forceUpdate();
    })
  }

  selectUser(field, event) {
    let { project } = this.state;
    let selected = project[field];
    select.select4ProjectMember(event.currentTarget, selected, selecting => {
      project[field] = selecting;
      this.forceUpdate();
    }, project);
  }

  selectProject(field, event) {
    let { project } = this.state;
    let selected = project[field];
    select.selectMenu(event.currentTarget, selected, selecting => {
      project[field] = selecting.id;
      project.name = selecting.ProjectName;
      this.forceUpdate();
    }, {
        searchable: true,
        data: () => workloadService.myProjects()
          .then(projects =>
            projects.map(project => ({
              id: project.ProjectID, name: `[${project.ProjectID}]${project.ProjectName}`,
              ProjectName: project.ProjectName
            })))
      });
  }

  addPacket(quick) {
    let { packets } = this.state.project;
    packets.push({ name: quick.title, active: true });
    this.quick.title = '';
    this.forceUpdate();
  }

  editPacket(updator, input) {
    let { packets } = this.state.project;
    updator(input);
    this.forceUpdate();
  }

  render() {
    let pProject = this.props.project || {};
    let { project } = this.state;
    let owner = project.owner || { name: '无所有者' };
    let members = project.members || [];
    let team = project.team || { name: '未指派团队' };
    let { currentUser } = userService;

    return (
      <form className='smart-form' onSubmit={this.handleSubmit.bind(this)}>
        <FormItem label='名称'>
          <div>
            <div className="col-sm-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <button type='button' disabled={project.id} className='btn btn-default form-control' onClick={this.selectProject.bind(this, 'id')}>
                {project.id || '个人项目'} <i className="caret" />
              </button>
            </div>
            <div className="col-sm-8">
              <input type='text' className='form-control' placeholder='名称'
                value={project.name} onChange={this.changeEntity.bind(this, 'name')} />
            </div>
          </div>
        </FormItem>
        <FormItem>
          <IconText icon='user' text={owner.name}
            onClick={this.selectUser.bind(this, 'owner')} />
        </FormItem>
        <FormItem label='团队'>
          <IconText icon='th-large' text={team.name}
            onClick={this.selectTeam.bind(this)} />
        </FormItem>
        <FormItem label='成员'>
          <div>
            {members.map((member, i) =>
              <IconText key={i} icon='user' text={member.name} />
            )}
            <IconText icon='plus'
              onClick={this.selectUser.bind(this, 'members')} />
          </div>
        </FormItem>
        {project.packets &&
          <FormItem label='工作包'>
            <div className='well-wrap'>
              <ul className='editable'>
                {project.packets.map((packet, i) =>
                  <ListItem key={i} item={{
                    label: <EditableText className='flex' style={{ flex: 1 }} value={packet.name}
                      onSubmit={this.editPacket.bind(this, text => packet.name = text.value)} />,
                    checked: !packet.active, completed: !packet.active
                  }} onCheck={this.editPacket.bind(this, () => packet.active = !packet.active)} />
                )}
              </ul>
              <QuickAdd placeHolder='添加工作包' onSubmit={this.addPacket.bind(this)} data={this.quick} />
            </div>
          </FormItem>}
        <FormItem>
          <div>
            <button type='submit' className='btn btn-primary btn-sm'
              disabled={pProject.owner && pProject.owner._id != currentUser._id}>确定</button>
            <button type='button' className='btn btn-link btn-sm' onClick={this.dismiss}>取消</button>
            {pProject.owner && pProject.owner._id == currentUser._id &&
              <button type='button' className='btn btn-danger btn-sm pull-right' onClick={this.deleteProject.bind(this)}>删除项目</button>}
          </div>
        </FormItem>
      </form>
    )
  }
}

export default ProjectSetting
