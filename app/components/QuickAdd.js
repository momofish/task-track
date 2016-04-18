import React from 'react';

class QuickAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: props.title}
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
      <form ref='form' onSubmit={this.props.onSubmit.bind(this)} className='animated'>
        <div className='input-group'>
          <input type='text' className='form-control' placeholder={this.props.placeHolder} value={this.state.title} onChange={this.handleChange.bind(this)} />
          <span className='input-group-btn'>
            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action <span class="caret"></span></button>
            <ul className="dropdown-menu dropdown-menu-right">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">Separated link</a></li>
            </ul>
            <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-plus'></span></button>
          </span>
        </div>
      </form>
    );
  }
}

export default QuickAdd;