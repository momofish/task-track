const moment = require('moment');
const mongoose = require('mongoose');
const _ = require('lodash');

const { Task, Workload, Project } = require('../models');
const { api, route } = require('../utils');
const config = require('../config');

const baseUri = '/workload';
const parsePeriod = (mode, date) => {
  let mDate = moment(date);
  let startDate = mDate.startOf('isoWeek').format('YYYY-MM-DD');
  let endDate = mDate.endOf('isoWeek').format('YYYY-MM-DD');
  if (mode == 1) {
    mDate = moment(date);
    if (mDate.date() >= 24) mDate.add(1, 'M');
    mDate.startOf('month');
    startDate = mDate.add(-1, 'M').add(23, 'd').format('YYYY-MM-DD');
    endDate = mDate.add(1, 'M').add(-1, 'd').format('YYYY-MM-DD');
  }

  return ({ startDate, endDate });
}
const workloadServiceBaseUri = `${config.evmSiteUrl}/Services/WorkloadService`;

module.exports = function (router) {
  router.route(`${baseUri}/todos`)
    // 获取待办数
    .get(route.wrap(async (req, res) => {
      let { user } = req;
      // 待审批数：所管理项目的工作量待审批记录数
      let projects = await Project.find({ owner: user._id }).select('_id');
      let approve = await Workload.find({ project: { $in: projects.map(p => p._id) }, status: 1 }).count();

      res.send({ approve });
    }));

  router.route(`${baseUri}/todos/:category`)
    // 获取待办
    .get(route.wrap(async (req, res) => {
      let { user } = req;
      let { category } = req.params;
      let todos;
      if (category == 'approve') {
        // 待审批数：所管理项目的工作量待审批记录数
        let projects = await Project.find({ owner: user._id }).select('_id');
        todos = await Workload
          .find({ project: { $in: projects.map(p => p._id) }, status: 1 })
          .populate('project task owner', 'name title');
      }

      res.send(todos);
    }))
    // 提交审批
    .post(route.wrap(async (req, res) => {
      let { user } = req;
      let { category } = req.params;
      let { approves, agree, opinion } = req.body;

      if (agree) {
        // 按人、日期同步工作量（当前待审批工作量及相关人员日期已审批工作量）
        let workloads = await Workload
          .find({ _id: { $in: approves }, status: 1 })
          .populate('owner project task', 'id name title');
        // 待审按人员日期分组
        let workloadUnits = _.groupBy(workloads, workload =>
          `${workload.owner._id}|${workload.owner.id}|${moment(workload.date).format('YYYY-MM-DD')}`);
        // 根据分组找已审工作量
        for (let unit in workloadUnits) {
          let pair = unit.split('|');
          let approvedWorkloads = await Workload
            .find({ owner: pair[0], date: pair[2], status: 2 })
            .populate('owner project task', 'id name title');
          workloadUnits[unit] = workloadUnits[unit].concat(approvedWorkloads);
        }
        let toSync = _.chain(workloadUnits).mapKeys((value, key) => key.split('|').slice(1, 3).join('|'))
          .mapValues(value => value.map(w => ({
            projectId: w.project.id, taskId: w.task._id, taskName: w.task.title,
            date: w.date, workload: w.workload
          })));
        await api.fetch(`${workloadServiceBaseUri}/SyncWorkload`, {
          method: 'POST',
          body: JSON.stringify(toSync)
        });
      }

      for (let approve of approves) {
        await Workload.findByIdAndUpdate(approve, {
          $set: { status: agree ? 2 : 3, opinion }
        });
      }

      res.sendStatus(204);
    }));

  router.route(`${baseUri}/:mode/:date`)
    // 待填报任务
    .get(route.wrap(async (req, res) => {
      let { user } = req;
      let { mode, date } = req.params;
      let { startDate, endDate } = parsePeriod(mode, date);

      let listWorkloadUri = `${workloadServiceBaseUri}/ListWorkload?userId=${user.id}&startDate=${startDate}&endDate=${endDate}`;
      let worksheet = await api.fetch(listWorkloadUri);

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

      let tasks = await Task.find({
        $or: [{
          $and: [
            { $or: [{ owner: user._id }, { members: { $in: [user._id] } }] },
            { startDate: { $lte: moment(endDate) }, endDate: { $gte: moment(startDate) } },
            { project: { $exists: true } }
          ]
        }, { _id: { $in: _.keys(worksheet.workloads) } }],

      }).select('_id title startDate endDate project')
        .populate('project', 'id name');
      worksheet.tasks = tasks.filter(task => task.project.id);

      res.send(worksheet);
    }))
    // 提交审批
    .post(route.wrap(async (req, res) => {
      let { user } = req;
      let owner = user._id;
      let { workloads } = req.body;

      for (let task in workloads) {
        let workloadsByDay = workloads[task];
        for (let date in workloadsByDay) {
          let wl = workloadsByDay[date];
          if (wl.status == 0) { // 待审批
            let workload = await Workload.findOne({ task, date, owner });

            if (!wl.workload) {
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

  router.route(`${baseUri}/myProjects`)
    .get(route.wrap(async (req, res) => {
      let { user } = req;
      let listProjectUri = `${workloadServiceBaseUri}/ListMyProject?loginId=${user.loginId}`;
      let projects = await api.fetch(listProjectUri);

      res.send(projects);
    }));
}