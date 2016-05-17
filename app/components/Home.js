import React from 'react';
import {Link} from 'react-router';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.history.pushState(null, '/tasks/my');
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default Home;