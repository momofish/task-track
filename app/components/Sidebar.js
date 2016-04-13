import React from 'react';
import {Link} from 'react-router';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange(state) {
    this.setState(state);
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
      sections = data.sections.map(section => (
        <div className='section'>
          <div className='section-header' data-toggle='collapse' aria-expanded='true'>
            <i className='glyphicon glyphicon-triangle-bottom' /> {section.header.label}
          </div>
          <ul className='section-body'>
            {section.body.map(item => (
              <li className='section-item'>
                <Link to={item.to}>
                  <i className='glyphicon glyphicon-briefcase' /> {item.label}
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