import React, { Component } from 'react';
import { Modal, FormItem, IconText, EditableText } from './common';
import { teamService, userService } from '../services';
import { select } from '../utils';

class TeamSetting extends Component {
  constructor(props) {
    super(props);
    let team = props.team || {};
    team.members = team.members || [];
    this.state = { team };
  }

  componentDidMount() {
    let {team} = this.props;
    if (team)
      teamService.getTeam(team._id)
        .then(team => this.setState({ team }));
  }

  dismiss(event) {
    Modal.close();
  }

  change(field, args) {
    let {team} = this.state;

    team[field] = args.value != undefined ? args.value :
      args.target.value;

    this.forceUpdate();
  }

  save() {
    let {state} = this.props;
    let {team} = this.state;

    state.updated = true;
    teamService.saveTeam(team)
      .then(this.dismiss);
  }

  submit(event) {
    event.preventDefault();

    let {team} = this.state;
    this.save(team);
  }

  selectUser(field, event) {
    let {team} = this.state;
    let selected = team[field];

    select.selectUser(event.currentTarget, selected, selecting => {
      team[field] = selecting;
      this.forceUpdate();
    });
  }

  render() {
    let pTeam = this.props.team || {};
    let {team} = this.state;
    let owner = team.owner || { name: '所有者' };
    let members = team.members || [];

    return (
      <form className='smart-form' onSubmit={this.submit.bind(this)}>
        <FormItem label='名称'>
          <input type='text' className='form-control'
            value={team.name} onChange={this.change.bind(this, 'name')} />
        </FormItem>
        <FormItem>
          <IconText icon='user' text={owner.name}
            onClick={this.selectUser.bind(this, 'owner')} />
        </FormItem>
        <FormItem>
          <EditableText multiline='true' value={team.description} placeholder='添加描述'
            onChange={this.change.bind(this, 'description')} />
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
        <FormItem>
          <div>
            <button type='submit' className='btn btn-primary btn-sm'
              disabled={pTeam.owner && pTeam.owner._id != userService.currentUser._id}>保存</button>
            <button type='button' className='btn btn-link btn-sm' onClick={this.dismiss}>取消</button>
          </div>
        </FormItem>
      </form>
    );
  }
}

export default TeamSetting;