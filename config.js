module.exports = {
  disableServerRender: true,

  mongoUri: process.env.MONGO_URI || 'localhost/task-track',

  ssoUri: process.env.SSO_URI || 'https://link.bingocc.cc:8080/sso',
  siteURL: process.env.SITE_URL || 'http://localhost:4000',

  loginUrl: process.env.LOGIN_URL || '/login'
};