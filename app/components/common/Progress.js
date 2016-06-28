import React, {Component} from 'react';

class Progress extends Component {
  render() {
    let bar = this.props.bar;

    return (
      <div className='progress'>
        <div className={`progress-bar progress-bar-${bar.type}`} style={{ width: `${bar.ratio * 100}%` }}>
        </div>
      </div>
    );
  }
}

export default Progress;