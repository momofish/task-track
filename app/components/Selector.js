import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PopBox from './PopBox';

class Selector extends Component {
  constructor(props) {
    super(props);

    this.state = { dataSourceIndex: 0, items: [] };
    this.cache = {};
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    let {dataSourceIndex} = this.state;
    let items = this.cache[dataSourceIndex];
    if(items){
      this.setState({items});
      return;
    }
    
    let dataSource = this.props.dataSources[dataSourceIndex];
    dataSource.data().then(items => {
      this.cache[dataSourceIndex] = items;
      this.setState({ items });
    });
  }

  changeTab(i) {
    this.state.dataSourceIndex = i;
    this.initData();
  }

  select(item) {
    let onSelect = this.props.onSelect;
    if (onSelect(item) === false)
      return;
    PopBox.close();
  }

  render() {
    let {dataSources, selected} = this.props;
    let {dataSourceIndex, items} = this.state;
    let dataSource = dataSources[dataSourceIndex];
    let {itemNameField} = dataSource;
    return (
      <div className='selector-container'>
        {dataSources.length > 1 ?
          <ul ref='tabs' className='nav nav-tabs flat'>
            {dataSources.map((dataSource, i) =>
              <li key={'t' + i} data-toggle="tab" className={dataSourceIndex == i ? 'active' : null}>
                <a href='#' onClick={() => this.changeTab(i) }>{dataSource.name}</a>
              </li>
            ) }
          </ul> : null
        }
        <div className='selector-search'>
          <input type="text" className="form-control" placeholder="请输入关键字" />
        </div>
        <div className='tab-pane active'>
          <ul className='selector-list'>
            {items.map(item =>
              <li key={item._id} className={selected && item._id == selected._id ? 'active' : null}>
                <a href='#' onClick={(ev) => { this.select(item); ev.preventDefault(); } }>{item[itemNameField || 'name']}</a>
              </li>
            ) }
          </ul>
        </div>
      </div>
    );
  }
}

Selector.open = function open(options) {
  let trigger = options.trigger;
  let boxOptions = { trigger, content: <Selector {...options} /> };
  PopBox.open(boxOptions);
}

export default Selector;