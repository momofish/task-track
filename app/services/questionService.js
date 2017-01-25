import React, { Component } from 'React';
import { Link } from 'react-router';
import moment from 'moment';

import { get, save, put } from './apiService';

const resourceUrl = '/api/questions';

export default {
  getQuestion(id) {
    return get(`${resourceUrl}/${id}`);
  },

  getQuestions(category, filter, pageNo) {
    return get(`${resourceUrl}/${category}/${filter || 'index'}/${pageNo || ''}`);
  },

  saveQuestion(question) {
    return save(resourceUrl, question);
  },

  addComment(id, comment) {
    return put(`${resourceUrl}/${id}/comments`, comment);
  },

  mapItem(question) {
    return {
      data: question,
      label: question.title,
      to: `/know/q/v/${question._id}`,
      tags: question.tags.map(tag => ({ label: tag.name, style: 'info', to: `/know/q/t/${tag.name}` })),
      sub:
      <h3 className='item-sub'>
        <Link to={`/know/q/u/${question.author._id}`}>{(question.author || { name: '匿名' }).name}</Link> - {`${moment(question.answeredOn || question.createdOn).fromNow()}${question.answeredOn ? '回答' : '提问'}`}
      </h3>,
      indicators: [
        { value: question.reward || 0, label: '悬赏', className: 'info' },
        {
          value: question.answers || 0, label: question.resolved ? <i className='glyphicon glyphicon-ok' /> : '回答',
          className: question.resolved ? 'complete' : question.answers ? 'success' : 'error'
        },
        { value: question.visits || 0, label: '浏览' },
      ]
    };
  }
}