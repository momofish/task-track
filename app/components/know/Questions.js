import React, { Component } from 'React';
import { Link } from 'react-router';

import { PagedList } from '../common';
import { questionService } from '../../services'

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: { code: null, name: '分类' }, tags: [],
      questions: {}
    };
  }

  async componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    this.getData();
  }

  async getData() {
    let {params} = this.props;
    let {category} = params;
    let questions = await questionService.getQuestions(category);
    this.setState({ questions: this.map2PagedList(questions) });
  }

  map2PagedList(questions) {
    return {
      list: questions.map(question => ({
        label: question.title,
        tags: question.tags,
        sub: <span>
          <Link to=''>{question.author.name}</Link> - <Link to=''></Link>
        </span>,
        indicators: [
          { value: question.answers || 0, label: '回答', className: 'error' },
          { value: question.visitors || 0, label: '浏览' },
        ]
      }))
    };
  }

  render() {
    let {questions} = this.state;

    return (
      <div className='container-fluid flex flex-verticle'>
        <div className='page-header'>
          <h2>
            <i className='glyphicon glyphicon-tasks' /> 问答
          </h2>
        </div>
        <PagedList data={questions}></PagedList>
      </div>
    )
  }
}