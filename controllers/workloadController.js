import fetch from 'node-fetch';
import moment from 'moment';
import mongoose from 'mongoose';
import _ from 'lodash';

import {Task, Workload, Project} from '../models';
import * as config from '../config';

const baseUri = '/workload';
const wrap = fn => (...args) => fn(...args).catch(args[2])
const parsePeriod = (mode, date) => {
  let mDate = moment(date);
  let startDate = mDate.startOf('isoWeek').format('L');
  let endDate = mDate.endOf('isoWeek').format('L');
  if (mode == 1) {
    let month = (mDate.date() >= 24 ? mDate.add(1, 'M') : mDate).startOf('month');
    startDate = month.add(-1, 'M').add(23, 'd').format('L');
    endDate = month.add(22, 'd').format('L');
  }

  return ({ startDate, endDate });
}

module.exports = function (router) {
  router.route(`${baseUri}/todos`)
    .get(wrap(async (req, res) => {
      let {user} = req;
      // 待审批数：所管理项目的工作量待审批记录数
      let projects = await Project.find({ owner: user._id }).select('_id');
      let approve = await Workload.find({ project: { $in: projects.map(p => p._id) }, status: 1 }).count();

      res.send({ approve });
    }));

  router.route(`${baseUri}/todos/:category`)
    .get(wrap(async (req, res) => { // 获取待办
      let {user} = req;
      let {category} = req.params;
      let result;
      if (category == 'approve') {
        // 待审批数：所管理项目的工作量待审批记录数
        let projects = await Project.find({ owner: user._id }).select('_id');
        result = await Workload
          .find({ project: { $in: projects.map(p => p._id) }, status: 1 })
          .populate('project task owner', 'name title');
      }

      res.send(result);
    }))
    .post(wrap(async (req, res) => { // 提交审批
      let {user} = req;
      let {category} = req.params;
      let {approves, agree, opinion} = req.body;

      if (agree) {
        // 同步工作量
      }

      for (let approve of approves) {
        await Workload.findByIdAndUpdate(approve, { $set: { status: agree ? 2 : 3, opinion } });
      }

      res.sendStatus(204);
    }));

  router.route(`${baseUri}/:mode/:date`)
    .get(wrap(async (req, res) => {
      let {user} = req;
      let {mode, date} = req.params;
      let {startDate, endDate} = parsePeriod(mode, date);

      let workloadServiceUri = `${config.evmSiteUrl}/Services/WorkloadService/ListWorkload?userId=${user.id}&startDate=${startDate}&endDate=${endDate}`;
      let fWorksheet = await fetch(workloadServiceUri);
      let worksheet = await fWorksheet.json();
      if (fWorksheet.status >= 400)
        throw new Error(worksheet.ExceptionMessage);

      let tasks = await Task.find({
        $and: [
          { $or: [{ owner: user._id }, { members: { $in: [user._id] } }] },
          { $or: [{ startDate: { $lt: endDate } }, { startDate: { $exists: false } }] },
          { $or: [{ endDate: { $gt: startDate } }, { endDate: { $exists: false } }] },
          { project: { $exists: true } }
        ]
      }).select('_id title startDate endDate project')
        .populate('project', 'id name type');
      worksheet.tasks = tasks.filter(task => task.project.type == 1);

      let aWorkloads = await Workload.find({
        $and: [
          { owner: user._id },
          { date: { $gte: startDate } },
          { date: { $lte: endDate } }
        ]
      });
      let workloads = _.chain(aWorkloads)
        .groupBy('task')
        .mapValues(wls =>
          _.chain(wls)
            .groupBy(wl => moment(wl.date).format('YYYY-MM-DD'))
            .mapValues(wl => wl.pop())
        ).value();
      worksheet.workloads = Object.assign(worksheet.workloads, workloads);

      res.send(worksheet);
    }))
    .post(wrap(async (req, res) => {
      let {user} = req;
      let owner = user._id;
      let {workloads} = req.body;

      for (let task in workloads) {
        let workloadsByDay = workloads[task];
        for (let date in workloadsByDay) {
          let wl = workloadsByDay[date];
          if (wl.status == 0) { // 待审批
            let workload = await Workload.findOne({ task, date, owner });

            if (!(wl.workload * 1)) {
              if (workload)
                await Workload.findOneAndRemove({ _id: workload._id });
              continue;
            }

            if (workload == null)
              workload = new Workload({ task, date, owner });

            workload.workload = wl.workload;
            if (!workload.project) {
              let taskInDb = await Task.findById(task).select('project');
              workload.project = taskInDb.project;
            }
            workload.status = 1;

            await workload.save();
          }
        }
      }
      res.sendStatus(204);
    }));
}