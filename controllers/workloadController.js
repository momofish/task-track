import fetch from 'node-fetch';
import moment from 'moment';
import mongoose from 'mongoose';
import {Task} from '../models';
import * as config from '../config';

const wrap = fn => (...args) => fn(...args).catch(args[2])

module.exports = function (router) {
  router.route('/workload/:mode/:date').get(wrap(async (req, res) => {
    var {user} = req;
    let {mode, date} = req.params;

    let mDate = moment(date);
    let startDate = mDate.startOf('isoWeek').format('L');
    let endDate = mDate.endOf('isoWeek').format('L');

    let workloadServiceUri = `${config.evmSiteUrl}/Services/WorkloadService/ListWorkload?userId=${user.id}&startDate=${startDate}&endDate=${endDate}`;
    console.log(workloadServiceUri);
    let fWorksheet = await fetch(workloadServiceUri);
    let worksheet = await fWorksheet.json();
    if (fWorksheet.status >= 400)
      throw new Error(worksheet.ExceptionMessage);

    let tasks = await Task.find({
      $and: [
        { $or: [{ owner: user._id }, { members: { $in: [user._id] } }] },
        { $or: [{ startDate: { $lt: endDate } }, { startDate: { $exists: false } }] },
        { $or: [{ endDate: { $gt: startDate } }, { endDate: { $exists: false } }] },
      ]
    }).populate('project', 'id name');
    worksheet.tasks = tasks;

    res.send(worksheet);
  }));
}