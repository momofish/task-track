import React, {Component} from 'React';

export default class Questions extends Component {
  render() {
    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 问答
          </h2>
        </div>
      </div>
    )
  }
}