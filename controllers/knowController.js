import mongoose from 'mongoose';
import moment from 'moment';
import { assign } from 'lodash'

import { api, route } from '../utils';
import { Question, Blog } from '../models';

module.exports = function (router) {
  router.route('/know/:category')
    .get(route.wrap(async (req, res, next) => {
      let {user} = req;
      let {category} = req.params;

      if (category == 'latest') {
        let questions = await Question.find()
          .sort('-createdOn')
          .limit(5)
          .select('-answers -content')
          .populate('author tags', 'name title loginId');

        let blogs = await Blog.find()
          .sort('-createdOn')
          .limit(5)
          .select('-comments -content')
          .populate('author tags', 'name title loginId');

        res.send({ questions, blogs });
      }
      else {
        throw new Error('invalid params')
      }
    }));
}