const mongoose = require('mongoose');
const moment = require('moment');
const { assign } = require('lodash');

const { api, route, paging } = require('../utils');
const { Tag } = require('../models');

module.exports = function (router) {
  router.route('/tags/:category?/:filter?')
    .get(route.wrap(async (req, res, next) => {
      let {user} = req;
      let {category, filter} = req.params;

      let params = { active: true };

      if (category == 'all') { // 所有的
        assign(params, {
          active: undefined
        });
      }

      let tags = await Tag.find(params)
        .select('name category')

      res.send(tags);
    }));
}