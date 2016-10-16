import mongoose from 'mongoose';

import {User, Dept} from '../models';
import { api, route } from '../utils';

const baseUri = '/system';

module.exports = function (router) {
  router.route(`${baseUri}/syncOu`).get(async function (req, res, next) {
    let depts = await Dept.find({id: {$exists: true}});
    let users = await User.find({id: {$exists: true}});
  });
}