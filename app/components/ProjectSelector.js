import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PopBox from './PopBox';

class ProjectSelector extends PopBox {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <PopBox>
        project
      </PopBox>
    );
  }
}

export default ProjectSelector;