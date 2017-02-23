module.exports = {
  disableServerRender: true,

  mongoUri: process.env.MONGO_URI || 'mongodb://localhost/task-track',

  ssoUri: process.env.SSO_URI || 'https://testsso.bingosoft.net',
  siteURL: process.env.SITE_URL || 'http://localhost:4000',

  enableHttps: process.env.ENABLE_HTTPS == "true",

  loginPath: process.env.LOGIN_PATH || '/login',

  evmSiteUrl: process.env.EVM_SITE_URL || 'http://tproject.bingosoft.net:88/Portal',

  assetRoot: process.env.ASSET_ROOT || 'assets',
};