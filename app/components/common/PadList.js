import React, { Component } from 'react';
import classnames from 'classnames';

import ListItem from './ListItem';

class PadList extends Component {
  constructor(props) {
    super(props);
    this.state = { regedSort: false };
  }

  handleSelect(item, event) {
    this.props.onSelect(...arguments);
  }

  handleClickTag(item, tag, event) {
    this.props.onClickTag(...arguments);
  }

  setSortable() {
    let {onSort} = this.props;
    let that = this;
    let {padList} = this.refs;
    
    if (!this.state.regedSort && padList.querySelectorAll('.pad-body').length) {
      for (let list of padList.querySelectorAll('.pad-body')) {
        Sortable.create(list, {
          group: {
            pull: 'clone'
          },
          onEnd: e => {
            let groups = that.props.data;
            let group = $(e.item.parentElement).attr('data');
            let index = e.newIndex;
            let oldGroup = $(e.from).attr('data');
            let oldIndex = e.oldIndex;
            if (oldGroup != group)
              $(e.item).remove();
            let data = groups[oldGroup].body[oldIndex];
            data && onSort && onSort({ group, index, item: data });
          }
        });
      }
      this.state.regedSort = true;
    }
  }

  componentDidUpdate() {
    this.setSortable();
  }

  render() {
    let groups = this.props.data;

    return (
      <div className='flex flex-hscroll' ref='padList'>
        <div className='scroll-container'>
          {groups.map((group, i) => (
            <div className='pad-list' key={i}>
              <div className='well-wrap'>
                <div className='pad-header'>{group.header.label}</div>
                <ul className={`pad-body`} data={i}>
                  {group.body.map((item, j) => (
                    <ListItem className='pad-item' item={item} key={j}
                      onCheck={this.props.onCheck}
                      onClick={this.handleSelect.bind(this, item.data)}
                      onClickTag={this.handleClickTag.bind(this)} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default PadList;