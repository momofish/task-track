import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PopBox from './PopBox';

class ProjectSelector extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='selector-container'>
        <ul className='nav nav-tabs flat'>
          <li data-toggle="tab" className='active'><a href='#myPrj'>我的项目</a></li>
          <li data-toggle="tab"><a href='#myPartPrj'>参与项目</a></li>
        </ul>
        <div className='tab-content'>
          <div id='myPrj' className='tab-pane active'>我的项目列表</div>
          <div id='myPartPrj' className='tab-pane'>我参与的项目列表</div>
        </div>
      </div>
    );
  }
}

export default ProjectSelector;