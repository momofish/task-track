import React, {Component} from 'react';
import classnames from 'classnames';
import ListItem from './ListItem';

class PadList extends Component {
  constructor(props) {
    super(props);
  }

  handleSelect(item, event) {
    this.props.onSelect(...arguments);
  }

  handleClickTag(item, tag, event) {
    this.props.onClickTag(...arguments);
  }

  render() {
    let groups = this.props.data;

    return (
      <div className='flex flex-hscroll'>
        <div className='scroll-container'>
          {groups.map((group, i) => (
            <div className='pad-list' key={i}>
              <div className='well-wrap'>
                <div className='pad-header'>{group.header.label}</div>
                <ul className={`pad-body`}>
                  {group.body.map((item, j) => (
                    <ListItem className='pad-item' item={item} key={j}
                      onCheck={this.props.onCheck}
                      onClick={this.handleSelect.bind(this, item.data) }
                      onClickTag={this.handleClickTag.bind(this) } />
                  )) }
                </ul>
              </div>
            </div>
          )) }
        </div>
      </div>
    );
  }
}

export default PadList;