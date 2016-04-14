import React from 'react';
import {Link} from 'react-router';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container-fluid'>
        <h4 className='page-header'><i className='glyphicon glyphicon-tasks' /> 我的任务</h4>
      </div>
    );
  }
}

export default Home;