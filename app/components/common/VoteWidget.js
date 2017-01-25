import React, { Component } from 'react';

class VoteWidget extends Component {
  render() {
    let {votes = 0} = this.props;

    return (
      <div className='vote-widget'>
        <i className='glyphicon glyphicon-triangle-top' />
        <span>{votes}</span>
        <i className='glyphicon glyphicon-triangle-bottom' />
      </div>
    );
  }
}

export default VoteWidget;