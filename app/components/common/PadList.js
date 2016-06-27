import React, {Component} from 'react';
import classnames from 'classnames';

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
            <div className='pad-list' key={`${i}`}>
              <div className='well-wrap'>
                <div className='pad-header'>{group.header.label}</div>
                <ul className={`pad-body`}>
                  {group.body.map((item, j) => (
                    <li className='pad-item' key={`${j}`}
                      onClick={this.handleSelect.bind(this, item.data) }>
                      <div className={classnames('pad-title', { completed: item.completed }) }>
                        {item.label}
                      </div>
                      <div className='pad-tags'>
                        {item.tags.filter(tag => tag && (tag.label || tag.icon)).map((tag, k) => (
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
            </div>
          )) }
        </div>
      </div>
    );
  }
}

export default PadList;