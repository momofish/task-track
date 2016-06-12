import React, {Component} from 'react';

class componentName extends Component {
  render() {
    let label = this.props.label;
    let content = this.props.content;

    return (
      <div className='form-item'>
        <div className='item-label'>{label}</div>
        {content instanceof Array ? content.map((inner, i) =>
          <div key={i} className='item-content'>
            {inner}
          </div>
        ) : <div className='item-content'>
            {content}
          </div>
        }
      </div>
    );
  }
}

export default componentName;