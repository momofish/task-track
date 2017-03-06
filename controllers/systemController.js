import mongoose from 'mongoose';
import _ from 'lodash';

import { User, Dept, Project } from '../models';
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
        id: user.id, name: user.name, enabled: true, loginId: user.loginId.trim().toLowerCase(), password: '1',
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

  router.route(`${baseUri}/createDeptProjects`).get(route.wrap(async function (req, res, next) {
    let projects = await api.fetch(`${workloadServiceBaseUri}/ListDeptProject`);

    // 将部门(按id)、用户(按id)转为dictionary，并将用户按部门分组
    let localUsers = await User.find({ id: { $exists: true } });
    let deptUsers = _.groupBy(localUsers, 'dept');
    localUsers = _.zipObject(_.map(localUsers, 'id'), localUsers);
    let localDepts = await Dept.find({ id: { $exists: true } });
    localDepts.forEach(d => d.users = deptUsers[d._id]);
    localDepts = _.zipObject(_.map(localDepts, 'id'), localDepts);

    // 对比本地项目，同步项目名称、所有者、成员
    let localProjects = await Project.find({ id: RegExp('^BSDEPT', 'i') });
    let localProjectsById = _.groupBy(localProjects, 'id');
    for (let project of projects) {
      if (!project.PMUID) continue;
      if (!localDepts[project.DeptUID]) continue;

      let localProjects2 = localProjectsById[project.ProjectID] || [];
      if (!localProjects2.length) localProjects2.push(new Project({
        name: project.ProjectName,
      }));
      for (let localProject of localProjects2) {
        Object.assign(localProject, {
          id: project.ProjectID,
          owner: localUsers[project.PMUID],
          members: (localDepts[project.DeptUID].users || []).map(u => u._id),
        });
        await localProject.save();
      }
    }

    res.sendStatus(204);
  }));
}