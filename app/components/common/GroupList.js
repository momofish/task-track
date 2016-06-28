import React, {Component} from 'react';
import ListItem from './ListItem';

class GroupList extends Component {
  constructor(props) {
    super(props);
  }

  handleSelect() {
    this.props.onSelect(...arguments);
  }

  handleClickTag() {
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
          <div className='group-list' key={i}>
            <a className='group-header' data-toggle='collapse'
              onClick={this.handleCollapse.bind(this, group) }
              href={`.group-list:nth-child(${i + 1}) > .group-body`}>
              <i className={`glyphicon glyphicon-triangle-${group.collapsed ? 'right' : 'bottom'}`} /> {group.header.label + ` (${group.body.length})`}
            </a>
            <ul className={`group-body collapse ${!group.collapsed ? 'in' : ''}`}>
              {group.body.map((item, j) => (
                <ListItem className='group-item' item={item} key={j}
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