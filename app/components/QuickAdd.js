import React from 'react';

class QuickAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: ''}
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  
  handleChange(event) {
    this.setState({title: event.target.value}); 
  }
  
  handleSubmit(event) {
    event.preventDefault();

    let title = this.state.title.trim();

    if (title) {
      this.props.onSubmit(this.state);
    }
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit.bind(this)}>
        <div className='input-group'>
          <input type='text' className='form-control' placeholder='快速添加' value={this.state.title} onChange={this.handleChange.bind(this)} />
          <span className='input-group-btn'>
            <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
          </span>
        </div>
      </form>
    );
  }
}

export default QuickAdd;