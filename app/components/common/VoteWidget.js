import React, { Component } from 'react';
import classsnames from 'classnames';

import { questionService, apiService } from '../../services';

class VoteWidget extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  async voteChange(voteNum) {
    let {voteUri} = this.props;
    if (!voteUri)
      return;

    let result = await apiService.save(voteUri, { voteNum });
    this.setState({ voteNum: result.voteNum });
  }

  render() {
    let {voteNum = 0, accept} = this.props;
    if (this.state.voteNum != undefined)
      voteNum = this.state.voteNum;
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