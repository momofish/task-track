import React, {Component} from 'react';
import classnames from 'classnames';

class GroupList extends Component {
  constructor(props) {
    super(props);
  }

  handleSelect(item, event) {
    this.props.onSelect(...arguments);
  }

  handleClickTag(item, tag, event) {
    this.props.onClickTag(...arguments);
  }

  handleCollapse(group, event) {
    group.collapsed = !group.collapsed;
    event.currentTarget
      .querySelector('.glyphicon')
      .className = `glyphicon glyphicon-triangle-${group.collapsed ? 'right' : 'bottom'}`
  }

  render() {
    let groups = this.props.data;

    return (
      <div className='flex-scroll'>
        {groups.map((group, i) => (
          <div className='group-list' key={`${i}`}>
            <a className='group-header' data-toggle='collapse'
              onClick={this.handleCollapse.bind(this, group) }
              href={`.group-list:nth-child(${i + 1}) > .group-body`}>
              <i className={`glyphicon glyphicon-triangle-${group.collapsed ? 'right' : 'bottom'}`} /> {group.header.label + ` (${group.body.length})`}
            </a>
            <ul className={`group-body collapse ${!group.collapsed ? 'in' : ''}`}>
              {group.body.map((item, j) => (
                <li className='group-item' key={`${j}`}
                  onClick={this.handleSelect.bind(this, item.data) }>
                  <span className={classnames('item-title', { completed: item.completed }) }>
                    {item.label}
                  </span>
                  <div className='item-tags'>
                    {item.tags.filter(tag => tag.label || tag.icon).map((tag, k) => (
                      <span key={`${k}`} className={`tag tag-${tag.style}`}
                        onClick={this.handleClickTag.bind(this, item.data, tag) }>
                        {tag.icon && <i className={`${'glyphicon glyphicon-' + tag.icon}`} />}
                        {tag.label}
                      </span>
                    )) }
                  </div>
                </li>
              )) }
            </ul>
          </div>
        )) }
      </div>
    );
  }
}

export default GroupList;