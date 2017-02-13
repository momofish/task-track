import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import AuthorLink from '../components/know/AuthorLink';
import { get, save, put } from './apiService';

const resourceUrl = '/api/know';

export default {
  getData(id) {
    return get(`${resourceUrl}/${id}`);
  },
}