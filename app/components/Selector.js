import React, { Component, PropTypes } from 'react';
import PopBox from './PopBox';

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSourceIndex: 0, items: [], term: '' };
    this.cache = {};

    this.changeTerm = this.changeTerm.bind(this);
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    let {dataSourceIndex} = this.state;
    let items = this.cache[dataSourceIndex];
    if (items) {
      this.setState({ items });
      return;
    }

    let dataSource = this.props.dataSources[dataSourceIndex];
    let setItems = items => {
      this.cache[dataSourceIndex] = items;
      this.setState({ items });
    };
    if (dataSource.data instanceof Function)
      dataSource.data().then(setItems);
    else if (dataSource.data instanceof Array)
      setItems(dataSource.data);
  }

  changeTerm(ev) {
    this.setState({ term: ev.target.value });
  }

  changeTab(i) {
    this.state.dataSourceIndex = i;
    this.initData();
  }

  select(item) {
    let onSelect = this.props.onSelect;
    if (onSelect && onSelect(item) === false)
      return;
    PopBox.close();
  }

  render() {
    let {dataSources, selected} = this.props;
    let {dataSourceIndex, items, term} = this.state;
    let dataSource = dataSources[dataSourceIndex];
    let {itemNameField, searchable} = dataSource;
    itemNameField = itemNameField || 'name';
    let termReg = new RegExp(term, 'i')
    return (
      <div className='selector-container'>
        {dataSources.length > 1 ?
          <ul ref='tabs' className='nav nav-tabs flat'>
            {dataSources.map((dataSource, i) =>
              <li key={`t${i}`} data-toggle="tab" className={dataSourceIndex == i ? 'active' : null}>
                <a href='#' onClick={() => this.changeTab(i) }>{dataSource.name}</a>
              </li>
            ) }
          </ul> : null
        }
        {searchable ?
          <div className='selector-search'>
            <input type="text" className="form-control" placeholder="请输入关键字" onChange={this.changeTerm} />
          </div> : null
        }
        <div className='tab-pane active'>
          <ul className='selector-list'>
            {(items && items.length) ? items
              .filter(item => !termReg || item[itemNameField].search(termReg) >= 0)
              .map((item, i) =>
                <li key={`i${i}`} className={item === selected || selected && item._id && item._id === selected._id ? 'active' : null}>
                  <a href='javascript:void(0)' onClick={(ev) => this.select(item) }>{item[itemNameField]}</a>
                </li>
              ) : <li className='active'><a href='javascript:void(0)'>无更多数据</a></li> }
          </ul>
        </div>
      </div>
    );
  }
}

Selector.open = function open(options) {
  let target = options.target;
  let align = options.align;
  let boxOptions = { target, align, content: <Selector {...options} /> };
  PopBox.open(boxOptions);
}

export default Selector;