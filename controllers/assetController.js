const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const { Transform } = require('stream')

const { api, route } = require('../utils');
const config = require('../config');

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
  router.route(`${baseUri}/img`).post(upload.any(), route.wrap(async function (req, res, next) {
    let file = req.files[0];
    let md5 = crypto.createHash('md5');
    fs.createReadStream(`${assetRoot}/tmp/${file.filename}`).on('data', (chunk) => {
      md5.update(chunk);
    }).on('end', () => {
      let fileMd5 = md5.digest('hex');
      let path = `img/${fileMd5.substr(0, 2)}`;
      fs.mkdir(`${assetRoot}/${path}`, (err) => {
        if (err && err.code != 'EEXIST') return next(err);

        let filename = `${fileMd5}.${file.originalname.split('.').pop()}`;
        fs.rename(`${assetRoot}/tmp/${file.filename}`, `${assetRoot}/${path}/${filename}`, (err) => {
          if (err) return next(err);

          res.set({ 'Content-Type': 'text/html' }).send({
            success: 1,
            url: `${baseUri}/${path}/${filename}`,
          });
        })
      });
    });
  }));
}