import fs from 'fs';
import multer from 'multer';
import crypto from 'crypto';
import { Transform } from 'stream'

import { api, route } from '../utils';
import * as config from '../config';

const baseUri = '/assets';
const {assetRoot} = config;
const upload = multer({
  storage: multer.diskStorage({
    destination: `${assetRoot}/tmp`,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  })
})

module.exports = function (router) {
  router.app.route(`${baseUri}/img`).post(upload.any(), route.wrap(async function (req, res, next) {
    let file = req.files[0];
    let md5 = crypto.createHash('md5');
    fs.createReadStream(`${assetRoot}/tmp/${file.filename}`).on('data', (chunk) => {
      md5.update(chunk);
    }).on('end', () => {
      let fileMd5 = md5.digest('hex');
      let filename = `${fileMd5}.${file.originalname.split('.').pop()}`;
      fs.rename(`${assetRoot}/tmp/${file.filename}`, `${assetRoot}/img/${filename}`, (err) => {
        if (err) return next(err);

        res.send({
          success: 1,
          url: `${baseUri}/img/${filename}`,
        });
      })
    });
  }));
}