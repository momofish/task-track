import React, { Component } from 'react';
import { Link } from 'react-router';
import { Icon } from './common';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  handleCollapse(section, event) {
    section.collapsed = !section.collapsed;
    event.currentTarget
      .querySelector('.glyphicon')
      .className = `glyphicon glyphicon-triangle-${section.collapsed ? 'right' : 'bottom'}`
  }

  render() {
    let {onAdd, data} = this.props;
    let searchbar;
    if (data.searchbar) {
      searchbar = (
        <form className='searchbar' onSubmit={event => {
          event.preventDefault();
          let query = this.refs['query'];
          let {onSearch} = data.searchbar;
          if (onSearch) onSearch(query.value);
          query.value = '';
        }}>
          <input ref='query' type='text' className='form-control' placeholder='搜索' />
        </form>
      );
    }

    let sections;
    if (data.sections) {
      sections = data.sections.map((section, i) => (
        <div className='section' key={i}>
          <a className='section-header' data-toggle='collapse'
            onClick={this.handleCollapse.bind(this, section)}
            href={`.section:nth-child(${i + 2}) > .section-body`}>
            <Icon icon='triangle-bottom' />&nbsp;
            {section.header.icon && <Icon icon={section.header.icon} />}&nbsp;
            {section.header.label}
            {section.header.actionIcon && <Icon icon={section.header.actionIcon} onClick={section.header.onAction} className='action-icon' />}
          </a>
          <ul className='section-body collapse in'>
            {section.body.map((item, j) => (
              <li key={j}>
                <Link className='section-item text-overflow' to={item.to} title={item.label} activeClassName='active'>
                  <i className={`glyphicon glyphicon-${item.icon}`} /> {item.label}
                  {item.actionIcon && <Icon icon={item.actionIcon} onClick={item.onAction} className='action-icon' />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ));
    }

    return (
      <nav className='sidebar'>
        <div className='sidebar-header'>
          <span>{data.title}</span>
          {onAdd && <button type="button" className="btn btn-link pull-right"
            onClick={onAdd.bind(this)}>
            <span className='glyphicon glyphicon-plus'></span>
          </button>}
        </div>
        <div className='sidebar-body'>
          {searchbar}
          {sections}
        </div>
      </nav>
    );
  }
}

export default Sidebar;