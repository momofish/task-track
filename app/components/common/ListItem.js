import React, {Component} from 'react';
import classnames from 'classnames';

class ListItem extends Component {
  handleCheck(item, event) {
    event.stopPropagation();
    let {onCheck} = this.props;
    if (onCheck) onCheck(item, event);
  }

  render() {
    let {className, item, onCheck, onClick, onClickTag} = this.props;

    return (
      <li className={classnames(className)} onClick={onClick}>
        {onCheck && <input type='checkbox' checked={item.checked} onChange={this.handleCheck.bind(this, item) } />}
        <span className={classnames('item-title', { completed: item.completed }) }>
          {item.label}
        </span>
        <div className='item-tags'>
          {(item.tags || []).filter(tag => tag && (tag.label || tag.icon)).map((tag, k) => (
            <span key={k} className={`tag tag-${tag.style}`}
              onClick={event => onClickTag(item, tag, event) }>
              {tag.icon && <i className={`${'glyphicon glyphicon-' + tag.icon}`} />}
              {tag.label}
            </span>
          )) }
        </div>
      </li>
    );
  }
}

export default ListItem;