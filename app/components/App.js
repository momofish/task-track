import React from 'react';
import Navbar from './Navbar';

class App extends React.Component {
  render() {
    return (
      <div className='app-content'>
        <Navbar history={this.props.history} />
        {this.props.children}
      </div>
    );
  }
}

export default App;