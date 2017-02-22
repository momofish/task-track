import multer from 'multer';
import crypto from 'crypto';
import { Transform } from 'stream'

import { api, route } from '../utils';
import * as config from '../config';

const baseUri = '/assets';

class FilterTransform extends Transform {
  constructor(onData, onEnd) {
    super();
    this.onData = onData;
    this.onEnd = onEnd;
  }

  _transform(chunk, encoding, callback) {
    this.onData && this.onData(...arguments);
    this.push(chunk);
    callback();
  }

  _flush(callback) {
    this.onEnd && this.onEnd(...arguments);
    callback();
  }
}

module.exports = function (router) {
  function genFileName(file) {
    return file.originalname;
  }

  let upload = multer({
    storage: multer.diskStorage({
      destination: 'assets/img',
      filename: (req, file, cb) => {
        let md5 = crypto.createHash('md5');
        file.stream.pipe(new FilterTransform((chunk) => {
          md5.update(chunk);
        }, () => {
          let fileMd5 = md5.digest('hex');
          cb(null, `${fileMd5}.${file.originalname.split('.').pop()}`);
        }));
      }
    })
  })

  router.route(`${baseUri}/img`).post(upload.single('editormd-image-file'), route.wrap(async function (req, res, next) {
    let {file} = req;
    res.send({
      success: 1,
      url: `/assets/img/${file.filename}`,
    });
  }));
}