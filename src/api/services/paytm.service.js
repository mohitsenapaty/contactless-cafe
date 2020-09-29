const axios = require('axios');
const {
  pick,
} = require('lodash');

const paytmChecksum = require('../utils/paytm.utils');
const { paytmConfig } = require('../../config/vars');

const callbackUrl = paytmConfig.callback;

const {
  initTxApiEndpoint,
  initTxPath,
  getPaymentStatusPath,
  fetchPayOptionsPath,
  processTxPath,
} = paytmConfig;
// const initTxPath = '/theia/api/v1/initiateTransaction';
// const getPaymentStatusPath = '/merchant-status/api/v1/getPaymentStatus';
// const fetchPayOptionsPath = '/theia/api/v2/fetchPaymentOptions';
// const processTxPath = '/theia/api/v1/initiateTransaction';

const { logger } = require('../../config/logger');

exports.initTx = async (params) => {
  const reqBody = {
    body: {
      requestType: 'Payment',
      mid: paytmConfig.mid,
      orderId: params.paymentid,
      websiteName: paytmConfig.website,
      callbackUrl,
      txnAmount: {
        value: params.value,
        currency: 'INR',
      },
      userInfo: {
        custId: params.orderid,
      },
    },
    head: {},
  };
  // eslint-disable-next-line max-len
  const checkSum = await paytmChecksum.generateSignature(JSON.stringify(reqBody.body), paytmConfig.key);
  console.log(checkSum);
  reqBody.head.signature = checkSum;
  logger.info(reqBody);
  const options = {
    method: 'POST',
    url: `${initTxApiEndpoint}${initTxPath}?mid=${paytmConfig.mid}&orderId=${params.paymentid}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: reqBody,
  };
  logger.info('disbursement-engine Validation API - Params: ', options);

  const apiResponse = await axios(options);
  console.log(JSON.stringify(apiResponse.data));
  return apiResponse.data;
};

exports.initTxUPI = async (params) => {
  const reqBody = {
    body: {
      requestType: 'Payment',
      mid: paytmConfig.mid,
      orderId: params.paymentid,
      websiteName: paytmConfig.website,
      txnAmount: {
        value: params.value,
        currency: 'INR',
      },
      userInfo: {
        custId: params.orderid,
      },
      enablePaymentMode: [
        { mode: 'UPI', channels: ['UPI'] },
      ],
    },
    head: {},
  };
  // eslint-disable-next-line max-len
  const checkSum = await paytmChecksum.generateSignature(JSON.stringify(reqBody.body), paytmConfig.key);
  console.log(checkSum);
  reqBody.head.signature = checkSum;
  logger.info(reqBody);
  const options = {
    method: 'POST',
    url: `${initTxApiEndpoint}${initTxPath}?mid=${paytmConfig.mid}&orderId=${params.paymentid}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: reqBody,
  };
  logger.info('disbursement-engine Validation API - Params: ', options);

  const apiResponse = await axios(options);
  console.log(JSON.stringify(apiResponse.data));
  return apiResponse.data;
};


exports.getPaymentStatus = async (params) => {
  const reqBody = {
    body: {
      mid: paytmConfig.mid,
      orderId: params.paymentid,
    },
    head: {},
  };
  // eslint-disable-next-line max-len
  const checkSum = await paytmChecksum.generateSignature(JSON.stringify(reqBody.body), paytmConfig.key);
  console.log(checkSum);
  reqBody.head.signature = checkSum;
  logger.info(reqBody);
  const options = {
    method: 'POST',
    url: `${initTxApiEndpoint}${getPaymentStatusPath}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: reqBody,
  };
  logger.info('disbursement-engine Validation API - Params: ', options);

  const apiResponse = await axios(options);
  console.log(JSON.stringify(apiResponse.data));
  return apiResponse.data;
};

exports.fetchPayOptions = async (params) => {
  const reqBody = {
    head: {
      txnToken: params.txnToken,
    },
  };
  logger.info(reqBody);
  const options = {
    method: 'POST',
    url: `${initTxApiEndpoint}${fetchPayOptionsPath}?mid=${paytmConfig.mid}&orderId=${params.paymentid}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: reqBody,
  };
  logger.info('disbursement-engine Validation API - Params: ', options);

  const apiResponse = await axios(options);
  console.log(JSON.stringify(apiResponse.data));
  return apiResponse.data;
};

exports.processTx = async (params) => {
  const reqBody = {
    head: {
      txnToken: params.txnToken,
    },
    body: {
      requestType: 'NATIVE',
      mid: paytmConfig.mid,
      orderId: params.paymentid,
      paymentMode: 'UPI_INTENT',
      authMode: 'PIN',
      ...pick(params, ['paymentMode', 'authMode']),
    },
  };
  logger.info(reqBody);
  const options = {
    method: 'POST',
    url: `${initTxApiEndpoint}${processTxPath}?mid=${paytmConfig.mid}&orderId=${params.paymentid}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: reqBody,
  };
  logger.info('disbursement-engine Validation API - Params: ', options);

  const apiResponse = await axios(options);
  console.log(JSON.stringify(apiResponse.data));
  return apiResponse.data;
};
