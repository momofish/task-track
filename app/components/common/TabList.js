import React, {Component} from 'react';
import classnames from 'classnames';

class TabItem extends Component {
  render() {
    let {className, onSelect, data} = this.props;
    let {active, name, index} = data;

    return (
      <li role='presentation' className={classnames(className, { active: active }) }>
        <a href='#' onClick={() => onSelect(data)} role='tab' data-toggle='tab' aria-expanded='true'>{name}</a>
      </li>
    );
  }
}

class TabList extends Component {
  render() {
    let {data, onSelect} = this.props;
    let tabs = data.filter(item => !item.collapse)
    let collapseTabs = data.filter(item => item.collapse)

    return (
      <ul className='nav nav-tabs' role='tablist'>
        {tabs.map((tab, i) => <TabItem key={i} onSelect={onSelect} data={tab} />) }
        {collapseTabs && collapseTabs.length ? (
          <li role='presentation' className='dropdown'>
            <a href='#' className='dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>更多 <span className='caret'></span></a>
            <ul className='dropdown-menu' role='menu'>
              {collapseTabs.map((tab, i) => <TabItem key={i} onSelect={onSelect} data={tab} />) }
            </ul>
          </li>
        ) : null }
      </ul>
    );
  }
}

export default TabList;