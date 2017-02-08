import React, { Component } from 'react';
import classsnames from 'classnames';

class VoteWidget extends Component {
  render() {
    let {votes = 0, accept} = this.props;
    let {accepted, onAccept} = accept || {};

    return (
      <div>
        <div className='vote-widget'>
          <i className='glyphicon glyphicon-triangle-top' />
          <span>{votes}</span>
          <i className='glyphicon glyphicon-triangle-bottom' />
        </div>
        {accept && <div onClick={onAccept} className={classsnames('accept-widget', { accepted })}>
          <i className='glyphicon glyphicon-ok-sign' />
          <span>{accepted ? '已采纳' : '采纳'}</span>
        </div>}
      </div>
    );
  }
}

export default VoteWidget;