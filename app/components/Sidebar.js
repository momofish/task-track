import React, {Component} from 'react';
import {Link} from 'react-router';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleCollapse(section, event) {
    section.collapsed = !section.collapsed;
    event.currentTarget
      .querySelector('.glyphicon')
      .className = `glyphicon glyphicon-triangle-${section.collapsed ? 'right' : 'bottom'}`
  }

  render() {
    var data = this.props.data;
    var searchbar;
    if (data.searchbar) {
      searchbar = (
        <div className='searchbar'>
          <input type='text' className='form-control' placeholder='搜索' />
        </div>
      ); 
    }
    
    var sections;
    if (data.sections) {
      sections = data.sections.map((section, i) => (
        <div className='section' key={`section_${i}`}>
          <a className='section-header' data-toggle='collapse' onClick={this.handleCollapse.bind(this, section) } href={`.section:nth-child(${i + 2}) > .section-body`}>
            <i className='glyphicon glyphicon-triangle-bottom' /> {section.header.label}
          </a>
          <ul className='section-body collapse in'>
            {section.body.map((item, j) => (
              <li key={`sectionItem_${i}_${j}`}>
                <Link className='section-item' to={item.to} activeClassName='active'>
                  <i className={`glyphicon glyphicon-${item.icon}`} /> {item.label}
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
          <button type="button" className="btn btn-link pull-right"><span className='glyphicon glyphicon-plus'></span></button>
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