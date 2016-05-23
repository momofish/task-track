import React from 'react';

class QuickAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: props.title}
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  
  componentWillReceiveProps(nextProps) {
    this.state.title = nextProps.title;
  }
  
  handleChange(event) {
    this.setState({title: event.target.value}); 
  }
  
  handleSubmit(event) {
    event.preventDefault();

    let title = this.state.title.trim();

    if (title) {
      this.props.onSubmit(this.state, this.refs.form);
    }
  }

  render() {
    return (
      <form ref='form' onSubmit={this.handleSubmit.bind(this)} className='animated quickadd'>
        <div className='input-group'>
          <input type='text' className='form-control' placeholder={this.props.placeHolder} value={this.state.title} onChange={this.handleChange} />
          <span className='input-group-btn'>
            <button className='btn btn-default'><span className='glyphicon glyphicon-plus'></span></button>
          </span>
        </div>
      </form>
    );
  }
}

export default QuickAdd;