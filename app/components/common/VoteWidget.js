import React, { Component } from 'react';
import classsnames from 'classnames';

import { questionService, apiService } from '../../services';

class VoteWidget extends Component {
  voteChange(voteNum) {
    let {voteUri} = this.props;
    if (!voteUri)
      return;

    apiService.save(voteUri, { voteNum });
  }

  render() {
    let {voteNum = 0, accept} = this.props;
    let {accepted, onAccept} = accept || {};

    return (
      <div>
        <div className='vote-widget'>
          <i className='glyphicon glyphicon-triangle-top' onClick={this.voteChange.bind(this, 1)} />
          <span>{voteNum}</span>
          <i className='glyphicon glyphicon-triangle-bottom' onClick={this.voteChange.bind(this, -1)} />
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