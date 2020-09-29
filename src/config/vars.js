const path = require('path');
const { name, version } = require('../../package.json');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  pkgConfig: {
    name,
    version,
  },
  pg: {
    uri: process.env.DEV_DATABASE_URL,
  },
  paytmConfig: {
    mid: process.env.PAYTM_MID,
    key: process.env.PAYTM_KEY,
    website: process.env.PAYTM_WEBSITE,
    endpoint: process.env.PAYTM_URI,
    callback: process.env.PAYTM_CALLBACK,
    initTxApiEndpoint: 'https://securegw-stage.paytm.in',
    initTxPath: '/theia/api/v1/initiateTransaction',
    getPaymentStatusPath: '/merchant-status/api/v1/getPaymentStatus',
    fetchPayOptionsPath: '/theia/api/v2/fetchPaymentOptions',
    processTxPath: '/theia/api/v1/initiateTransaction',
  },
  targetUrl: process.env.TARGET_URL,
};
