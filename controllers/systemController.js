import mongoose from 'mongoose';
import _ from 'lodash';

import { User, Dept } from '../models';
import { api, route } from '../utils';
import * as config from '../config';

const baseUri = '/system';
const workloadServiceBaseUri = `${config.evmSiteUrl}/Services/WorkloadService`;

module.exports = function (router) {
  router.route(`${baseUri}/syncOu`).get(route.wrap(async function (req, res, next) {
    let ous = await api.fetch(`${workloadServiceBaseUri}/ListOus`);
    let depts = _.zipObject(_.map(ous.m_Item1, 'id'), ous.m_Item1);
    let users = _.zipObject(_.map(ous.m_Item2, 'id'), ous.m_Item2);

    let localDepts = await Dept.find({ id: { $exists: true } });
    localDepts = _.zipObject(_.map(localDepts, 'id'), localDepts);
    let localUsers = await User.find({ id: { $exists: true } });
    localUsers = _.zipObject(_.map(localUsers, 'id'), localUsers);

    for (let deptId in depts) {
      let dept = depts[deptId];
      let localDept = localDepts[dept.id] = localDepts[dept.id] || new Dept();
      Object.assign(localDept, {
        id: dept.id, name: dept.name, enabled: true,
        parent: dept.parent && localDepts[dept.parent]._id
      });
      await localDept.save();
    }
    for (let deptId in localDepts) {
      if (!depts[deptId] && localDepts[deptId].enabled) {
        let localDept = localDepts[deptId];
        localDept.enabled = false;
        await localDept.save();
      }
    }

    for (let userId in users) {
      let user = users[userId];
      let localUser = localUsers[user.id] = localUsers[user.id] || new User();
      Object.assign(localUser, {
        id: user.id, name: user.name, enabled: true, loginId: user.loginId, password: '1',
        dept: (localDepts[user.dept] || {})._id
      });
      await localUser.save();
    }
    for (let userId in localUsers) {
      if (!users[userId] && localUsers[userId].enabled) {
        let localUser = localUsers[userId];
        localUser.enabled = false;
        await localUser.save();
      }
    }

    res.sendStatus(204);
  }));
}