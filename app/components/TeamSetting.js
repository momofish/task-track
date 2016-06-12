import React, {Component} from 'react';
import FormItem from './FormItem';
import Modal from './Modal';
import {teamService} from '../services';

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

  dismiss() {
    Modal.close();
  }

  changeEntity(entity, field, event) {
    entity[field] = event.currentTarget.value;
  }

  saveEntity(entity) {
    teamService.saveTeam(entity)
      .then(this.dismiss);
  }

  handleSubmit(team, event) {
    event.preventDefault();
    this.saveEntity(team);
  }

  render() {
    let team = this.state.team;
    return (
      <form className='smart-form' onSubmit={this.handleSubmit.bind(this, team)}>
        <FormItem label='名称' content={
          <input type='text' className='form-control'
            value={team.name} onChange={this.changeEntity.bind(this, team, 'name') } />
        } />
        <FormItem label='负责人' />
        <FormItem label='成员' />
        <FormItem content={
          <div>
            <button type='submit' className='btn btn-primary btn-sm'>确定</button>
            <button className='btn btn-link btn-sm' onClick={this.dismiss}>取消</button>
          </div>
        } />
      </form>
    );
  }
}

export default TeamSetting;