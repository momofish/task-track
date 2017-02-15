import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import AuthorLink from '../components/know/AuthorLink';
import { get, save, put } from './apiService';

const resourceUrl = '/api/blogs';

export default {
  getBlog(id) {
    return get(`${resourceUrl}/${id}`);
  },

  getBlogs(category, filter, pageNo) {
    return get(`${resourceUrl}/${category}/${encodeURIComponent(filter || 'index')}/${pageNo || ''}`);
  },

  saveBlog(blog) {
    return save(resourceUrl, blog);
  },

  saveComment(id, comment) {
    return save(`${resourceUrl}/${id}/comments`, comment);
  },

  mapItem(blog) {
    return {
      data: blog,
      label: blog.title,
      to: `/know/b/v/${blog._id}`,
      tags: blog.tags.map(tag => ({ label: tag.name, style: 'primary', to: `/know/b/t/${encodeURIComponent(tag.name)}` })),
      sub:
      <h3 className='item-sub'>
        <AuthorLink author={blog.author} /> - {`${moment(blog.commentedOn || blog.createdOn).fromNow()}${blog.commentedOn ? '评论' : '发布'}`}
      </h3>,
      indicators: [
        { value: blog.voteNum || 0, label: '投票' },
        { value: blog.visitNum || 0, label: '浏览' },
      ]
    };
  }
}