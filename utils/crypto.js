var crypto = require('crypto');

function hash(algorithm = 'md5', content) {
  let hash = crypto.createHash(algorithm);
  hash.update(content);
  let result = hash.digest('hex');
  return result;
}

function hashMatch(algorithm = 'md5', content, toCompare) {
  return hash(algorithm, content) == toCompare
}

module.exports = {hash, hashMatch}
