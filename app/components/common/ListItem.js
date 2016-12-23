import React, {Component} from 'react';
import classnames from 'classnames';

class ListItem extends Component {
  check(item, event) {
    let {onCheck} = this.props;
    if (onCheck) onCheck(item, event);
  }

  checkClick(event) {
    event.stopPropagation();
  }

  render() {
    let {className, item, onCheck, onClick, onClickTag} = this.props;

    return (
      <li className={classnames(className) } onClick={onClick} title={item.description}>
        <div className={classnames('item-title', { completed: item.completed }) }>
          {onCheck && <input type='checkbox' checked={item.checked} onChange={this.check.bind(this, item) } onClick={this.checkClick } />}
          {item.label}
        </div>
        <div className='item-tags'>
          {(item.tags || []).filter(tag => tag && (tag.label || tag.icon)).map((tag, k) => (
            <span key={k} className={`tag tag-${tag.style}`} title={tag.label}
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