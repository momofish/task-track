import React, { Component } from 'react';
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
      <li className={classnames('list-item', className)} onClick={onClick} title={item.description}>
        {item.indicators && <ul className='item-indicators'>
          {item.indicators.map((indicator, i) =>
            <li key={i} className={classnames(indicator.className)}>{indicator.value}<small>{indicator.label}</small></li>
          )}</ul>}
        <span className='item-content'>
          {item.sub}
          <h3 className={classnames('item-title', { completed: item.completed })}>
            {onCheck && <input type='checkbox' checked={item.checked} onChange={this.check.bind(this, item)} onClick={this.checkClick} />}
            {item.label}
          </h3>
          {item.tags && <ul className='item-tags'>
            {item.tags.filter(tag => tag.label || tag.icon).map((tag, k) => (
              <li key={k} className={`tag tag-${tag.style}`} title={tag.label}
                onClick={event => onClickTag && onClickTag(item, tag, event)}>
                {tag.icon && <i className={`${'glyphicon glyphicon-' + tag.icon}`} />}
                {tag.label}
              </li>
            ))}
          </ul>}
        </span>
      </li>
    );
  }
}

export default ListItem;