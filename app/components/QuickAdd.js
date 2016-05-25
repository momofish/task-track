import React from 'react';

class QuickAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.data;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    this.state = nextProps.data;
  }

  handleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    let title = this.state.title.trim();

    if (title) {
      this.props.onSubmit(this.state, this.refs.form);
    }
  }

  render() {
    let selectors = this.props.selectors || [];
    return (
      <form ref='form' onSubmit={this.handleSubmit} className='animated quickadd'>
        <div className='input-group'>
          <input type='text' className='form-control' placeholder={this.props.placeHolder} value={this.state.title} onChange={this.handleChange} />
          <span className='input-group-btn'>
            {selectors.map((selector, i) => (
              <button key={`s${i}`} type="button" className="btn btn-default" onClick={selector.onClick}>{selector.label} <i className="caret" /></button>
            )) }
            <button className='btn btn-default'><span className='glyphicon glyphicon-plus'></span></button>
          </span>
        </div>
      </form>
    );
  }
}

export default QuickAdd;