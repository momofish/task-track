import React from 'react';
import classnames from 'classnames';

class GroupList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleSelect(item, event) {
    this.props.onSelect(...arguments);
  }

  handleClickTag(item, tag, event) {
    this.props.onClickTag(...arguments);
  }

  render() {
    var groups = this.props.data;

    return (
      <div className='flex-scroll'>
        {groups.map((group, i) => (
          <div className='entry-group' key={`group_${i}`}>
            <div className='group-header' data-toggle='collapse' aria-expanded='true'>
              <i className='glyphicon glyphicon-triangle-bottom' /> {group.header.label}
            </div>
            <ul className='group-body'>
              {group.body.map((item, j) => (
                <li className='entry-item' key={`entry_${i}_${j}`}
                  onClick={this.handleSelect.bind(this, item.data) }>
                  <span className={classnames('entry-title', { completed: item.completed }) }>
                    {item.label}
                  </span>
                  <div className='entry-tags'>
                    {item.tags.filter(tag => tag.label || tag.icon).map((tag, k) => (
                      <span key={`tag-${k}`} className={`tag tag-${tag.style}`}
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