import React, {Component} from 'react';
import Navbar from './Navbar';

class App extends Component {
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