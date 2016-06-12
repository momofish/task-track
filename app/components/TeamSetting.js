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

  updateEntity(entity, field, event) {
    entity[field] = event.currentTarget.value;
  }

  saveEntity() {
  }

  render() {
    let team = this.state.team;
    return (
      <div className='smart-form'>
        <FormItem label='名称' content={
          <input type='text' className='form-control'
            value={team.name} onChange={this.updateEntity.bind(this, team, 'name') } />
        } />
        <FormItem label='负责人' />
        <FormItem label='成员' />
        <FormItem content={
          <div>
            <button className='btn btn-primary btn-sm' onClick={this.saveEntity.bind(this)}>确定</button>
            <button className='btn btn-link btn-sm' onClick={() => Modal.close()}>取消</button>
          </div>
        } />
      </div>
    );
  }
}

export default TeamSetting;