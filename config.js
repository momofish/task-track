module.exports = {
  disableServerRender: true,

  mongoUri: process.env.MONGO_URI || 'mongodb://localhost/task-track',

  ssoUri: process.env.SSO_URI || 'https://link.bingocc.cc:8080/sso',
  siteURL: process.env.SITE_URL || 'http://localhost:4000',

  loginPath: process.env.LOGIN_PATH || '/login'
};