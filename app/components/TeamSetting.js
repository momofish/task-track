import React, {Component} from 'react';
import {Modal, FormItem, SelectableText} from './common';
import {teamService} from '../services';
import {select} from '../utils';

class TeamSetting extends Component {
  constructor(props) {
    super(props);
    this.state = { team: props.team || {} };
  }

  componentDidMount() {
    let team = this.props.team;
    if (team)
      teamService.getTeam(team._id)
        .then(team => this.setState({ team }));
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
    teamService.saveTeam(entity)
      .then(this.dismiss);
  }

  handleSubmit(team, event) {
    event.preventDefault();
    this.saveEntity(team);
  }

  selectUser(field, event) {
    let team = this.state.team;
    let selected = team[field];
    select.selectUser(event.currentTarget, selected, selecting => {
      this.state.team[field] = selecting;
      this.forceUpdate();
    });
  }

  render() {
    let team = this.state.team;
    let owner = team.owner || { name: '无所有者' };
    let members = team.members || [];

    return (
      <form className='smart-form' onSubmit={this.handleSubmit.bind(this, team) }>
        <FormItem label='名称' content={
          <input type='text' className='form-control'
            value={team.name} onChange={this.changeEntity.bind(this, team, 'name') } />
        } />
        <FormItem>
          <SelectableText icon='user' text={owner.name}
            onClick={this.selectUser.bind(this, 'owner') } />
        </FormItem>
        <FormItem label='成员'>
          <div>
            {members.map((member, i) =>
              <SelectableText key={i} icon='user' text={member.name} />
            ) }
            <SelectableText icon='plus'
              onClick={this.selectUser.bind(this, 'members') } />
          </div>
        </FormItem>
        <FormItem content={
          <div>
            <button type='submit' className='btn btn-primary btn-sm'>确定</button>
            <button type='button' className='btn btn-link btn-sm' onClick={this.dismiss}>取消</button>
          </div>
        } />
      </form>
    );
  }
}

export default TeamSetting;