import fetch from 'node-fetch';
import moment from 'moment';
import mongoose from 'mongoose';
import _ from 'lodash';

import {Task, Workload} from '../models';
import * as config from '../config';

const baseUri = '/workload';
const wrap = fn => (...args) => fn(...args).catch(args[2])

function parsePeriod(mode, date) {
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
  router.route(`${baseUri}/:mode/:date`).get(wrap(async (req, res) => {
    var {user} = req;
    let {mode, date} = req.params;
    let {startDate, endDate} = parsePeriod(mode, date);

    let workloadServiceUri = `${config.evmSiteUrl}/Services/WorkloadService/ListWorkload?userId=${user.id}&startDate=${startDate}&endDate=${endDate}`;
    console.log(`fetching ${workloadServiceUri}`);
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

    let workloads = await Workload.find({
      $and: [
        { owner: user._id },
        { date: { $gte: startDate } },
        { date: { $lte: endDate } }
      ]
    });
    worksheet.workloads = _.chain(workloads)
      .groupBy('task')
      .mapValues(wls =>
        _.chain(wls)
          .groupBy(wl => moment(wl.date).format('YYYY-MM-DD'))
          .mapValues(wl => wl[0].workload)
      );

    res.send(worksheet);
  }));
}