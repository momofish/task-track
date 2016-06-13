import React, { Component, PropTypes } from 'react';
import PopBox from './PopBox';
import _ from 'underscore';

let selecting = null;

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSourceIndex: 0, items: [], term: '' };
    this.cache = {};

    this.changeTerm = this.changeTerm.bind(this);
    this.select = this.select.bind(this);
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    let {dataSourceIndex} = this.state;
    let items = this.cache[dataSourceIndex];
    if (items !== undefined) {
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
    else if (dataSource.data instanceof Object)
      setItems(_.pairs(dataSource.data).map(pair => {
        if (pair[1].key === undefined)
          pair[1].key = pair[0];
        return pair[1];
      }));
  }

  changeTerm(event) {
    this.setState({ term: event.target.value });
  }

  changeTab(i) {
    this.state.dataSourceIndex = i;
    this.initData();
  }

  getSelected(item, selected) {
    let multiple = selected instanceof Array;
    let checkSelected = (sel) => {
      if (selected == null) return false;
      return sel == item ||
        item.key == sel ||
        item._id && item._id == sel._id;
    }

    if (multiple)
      return _.find(selected, checkSelected);
    else
      return checkSelected(selected) ? item : null;
  }

  clickItem(item) {
    let multiple = selecting instanceof Array;

    if (multiple) {
      let selectedItem = this.getSelected(item, selecting);
      if (selectedItem != null)
        selecting.splice(_.indexOf(selecting, selectedItem), 1);
      else
        selecting.push(item);
      this.forceUpdate();
    }
    else {
      selecting = item;
      this.select();
    }
  }

  select() {
    let {onSelect} = this.props;
    if (onSelect && onSelect(selecting) === false)
      return;
    PopBox.close();
  }

  render() {
    let {dataSources} = this.props;
    let {dataSourceIndex, items, term} = this.state;
    let dataSource = dataSources[dataSourceIndex];
    let {itemNameField = 'name', searchable} = dataSource;
    let termReg = new RegExp(term, 'i');
    let multiple = selecting instanceof Array;

    return (
      <div className='selector-container'>
        {dataSources.length > 1 ?
          <ul ref='tabs' className='nav nav-tabs flat'>
            {dataSources.map((dataSource, i) =>
              <li key={`t${i}`} data-toggle="tab"
                className={dataSourceIndex == i ? 'active' : null}>
                <a href='#' onClick={() => this.changeTab(i) }>{dataSource.name}</a>
              </li>
            ) }
          </ul> : null
        }
        {searchable ?
          <div className='selector-search'>
            <input type="text" className="form-control" placeholder="请输入关键字"
              onChange={this.changeTerm} />
          </div> : null
        }
        <div className='tab-pane active'>
          <ul className='selector-list'>
            {(items && items.length) ? items
              .filter(item => !termReg || item[itemNameField].search(termReg) >= 0)
              .slice(0, 10)
              .map((item, i) => {
                let isSelected = this.getSelected(item, selecting) != null;
                return (<li key={`i${i}`} className={isSelected ? 'active' : null}>
                  <a href='javascript:' onClick={ev => this.clickItem(item) }>
                    {item[itemNameField]}
                    {multiple && isSelected && <i className='pull-right glyphicon glyphicon-ok' />}
                  </a>
                </li>);
              }) : <li className='active'><a href='javascript:'>无更多数据</a></li> }
          </ul>
          {multiple &&
            <div className='button-group'>
              <button className='btn btn-primary btn-sm' onClick={this.select}>确定</button>
              <button className='btn btn-link btn-sm' onClick={PopBox.close}>取消</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

Selector.open = function open(options) {
  let target = options.target;
  let align = options.align;
  let style = options.style;
  selecting = options.selected;
  if (selecting instanceof Array)
    selecting = selecting.concat();
  let boxOptions = { target, align, style, content: <Selector {...options} /> };
  PopBox.open(boxOptions);
}

export default Selector;