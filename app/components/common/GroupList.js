import React, {Component} from 'react';
import classnames from 'classnames';

import ListItem from './ListItem';

class GroupList extends Component {
  constructor(props) {
    super(props);
  }

  handleSelect() {
    let {onSelect} = this.props;
    onSelect && onSelect(...arguments);
  }

  handleClickTag() {
    let {onClickTag} = this.props;
    onClickTag && onClickTag(...arguments);
  }

  handleCollapse(group, event) {
    group.collapsed = !group.collapsed;
    event.currentTarget
      .querySelector('.glyphicon')
      .className = `glyphicon glyphicon-triangle-${group.collapsed ? 'right' : 'bottom'}`
  }

  render() {
    let groups = this.props.data;
    let {className, style} = this.props;

    return (
      <div className={classnames('flex-scroll', className) } style={style}>
        {groups.map((group, i) => (
          <div className='group-list' key={i}>
            <a className='list-header' data-toggle='collapse'
              onClick={this.handleCollapse.bind(this, group) }
              href={`.group-list:nth-child(${i + 1}) > .list-body`}>
              <i className={`glyphicon glyphicon-triangle-${group.collapsed ? 'right' : 'bottom'}`} /> {group.header.label + ` (${group.body.length})`}
            </a>
            <ul className={`list-body collapse ${!group.collapsed ? 'in' : ''}`}>
              {group.body.map((item, j) => (
                <ListItem item={item} key={j}
                  onCheck={this.props.onCheck}
                  onClick={this.handleSelect.bind(this, item.data) }
                  onClickTag={this.handleClickTag.bind(this) } />
              )) }
            </ul>
          </div>
        )) }
      </div>
    );
  }
}

export default GroupList;