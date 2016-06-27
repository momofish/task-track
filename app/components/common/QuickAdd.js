import React, {Component} from 'react';
import {select} from '../../utils';
import {assign} from 'underscore';

class QuickAdd extends Component {
  constructor(props) {
    super(props);
    this.state = props.data || {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.state = nextProps.data || {};
  }

  handleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    let {title} = this.state;
    let {onSubmit} = this.props;

    if (title && onSubmit) {
      onSubmit(this.state, this.refs.form);
    }
  }

  select(selector, event) {
    select[selector.type](event.currentTarget, this.state[selector.key], selection => {
      this.state[selector.key] = selection;
      this.forceUpdate();
    }, assign({ align: 'right' }, selector.options));
  }

  render() {
    let selectors = this.props.selectors || [];
    return (
      <form ref='form' onSubmit={this.handleSubmit} className='animated quickadd'>
        <div className='input-group'>
          <input type='text' className='form-control' placeholder={this.props.placeHolder} value={this.state.title} onChange={this.handleChange} />
          <span className='input-group-btn'>
            {selectors.map((selector, i) => (
              <button key={`s${i}`} type="button" className="btn btn-default" onClick={this.select.bind(this, selector) }>{this.state[selector.key] && selector.nameGetter(this.state[selector.key]) || selector.label} <i className="caret" /></button>
            )) }
            <button className='btn btn-default'><i className='glyphicon glyphicon-plus'/></button>
          </span>
        </div>
      </form>
    );
  }
}

export default QuickAdd;