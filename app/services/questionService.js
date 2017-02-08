import React, { Component } from 'React';
import { Link } from 'react-router';
import moment from 'moment';

import AuthorLink from '../components/know/AuthorLink';
import { get, save, put } from './apiService';

const resourceUrl = '/api/questions';

export default {
  getQuestion(id) {
    return get(`${resourceUrl}/${id}`);
  },

  getQuestions(category, filter, pageNo) {
    return get(`${resourceUrl}/${category}/${encodeURIComponent(filter || 'index')}/${pageNo || ''}`);
  },

  saveQuestion(question) {
    return save(resourceUrl, question);
  },

  saveAnswer(id, answer) {
    return save(`${resourceUrl}/${id}/answers`, answer);
  },

  mapItem(question) {
    return {
      data: question,
      label: question.title,
      to: `/know/q/v/${question._id}`,
      tags: question.tags.map(tag => ({ label: tag.name, style: 'primary', to: `/know/q/t/${encodeURIComponent(tag.name)}` })),
      sub:
      <h3 className='item-sub'>
        <AuthorLink author={question.author} /> - {`${moment(question.answeredOn || question.createdOn).fromNow()}${question.answeredOn ? '回答' : '提问'}`}
      </h3>,
      indicators: [
        { value: question.reward || 0, label: '悬赏', className: 'info' },
        {
          value: question.answerNum || 0, label: question.resolved ? <i className='glyphicon glyphicon-ok' /> : '回答',
          className: question.resolved ? 'complete' : question.answerNum ? 'success' : 'error'
        },
        { value: question.visits || 0, label: '浏览' },
      ]
    };
  }
}