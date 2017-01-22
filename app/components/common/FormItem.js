import React, { Component } from 'react';

class FormItem extends Component {
  render() {
    let {label, content, className, noLabel} = this.props;

    return (
      <div className={`form-item ${className}`}>
        {!noLabel && <div className='item-label'>{label}</div>}
        {content instanceof Array ? content.map((inner, i) =>
          <div key={i} className='item-content'>
            {inner}
          </div>
        ) : <div className='item-content'>
            {this.props.children || content}
          </div>
        }
      </div>
    );
  }
}

export default FormItem;