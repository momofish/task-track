import React, { Component, PropTypes } from 'react';
import PopBox from './PopBox';
import IconText from './IconText';
import _ from 'lodash';

let selecting = null;

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSourceIndex: 0, items: [], term: '' };
    this.cache = {};

    this.changeTerm = this.changeTerm.bind(this);
    this.select = this.select.bind(this);
  }

  static open(options) {
    let target = options.target;
    let align = options.align;
    let style = options.style;
    selecting = options.selected;
    if (selecting instanceof Array)
      selecting = selecting.concat();
    let boxOptions = { target, align, style, content: <Selector {...options} /> };
    PopBox.open(boxOptions);
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
    if (!dataSource)
      return;
      
    let setItems = items => {
      this.cache[dataSourceIndex] = items;
      this.setState({ items });
    };
    if (dataSource.data instanceof Function)
      dataSource.data().then(setItems);
    else if (dataSource.data instanceof Array)
      setItems(dataSource.data);
    else if (dataSource.data instanceof Object)
      setItems(_.toPairs(dataSource.data).map(pair => {
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
    let {dataSources, top = 10} = this.props;
    if (!dataSources || !dataSources.length) {
      return <div className='selector-container'></div>
    }
    let {dataSourceIndex, items, term} = this.state;
    let dataSource = dataSources[dataSourceIndex];
    let {nameField = 'name', searchable} = dataSource;
    let termReg = new RegExp(term, 'i');
    let multiple = selecting instanceof Array;

    return (
      <div className='selector-container'>
        {dataSources.length > 1 ?
          <ul ref='tabs' className='nav nav-tabs flat'>
            {dataSources.map((dataSource, i) =>
              <li key={i} data-toggle="tab"
                className={dataSourceIndex == i ? 'active' : null}>
                <a href='#' onClick={() => this.changeTab(i)}>{dataSource.name}</a>
              </li>
            )}
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
            {items && items.length ? items
              .filter(item => !termReg || item[nameField].search(termReg) >= 0)
              .slice(0, top)
              .map((item, i) => {
                let isSelected = this.getSelected(item, selecting) != null;
                return (<li key={item._id || i} className={isSelected ? 'active' : null}>
                  <IconText text={item[nameField]} icon={item.icon} onClick={event => this.clickItem(item)}>
                    {multiple && isSelected && <i className='pull-right glyphicon glyphicon-ok' />}
                  </IconText>
                </li>);
              }) : items ? <li className='active'><IconText text='无更多数据' /></li> : null}
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

export default Selector;