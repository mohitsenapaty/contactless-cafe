// const httpStatus = require('http-status');
// const { v4: uuidv4 } = require('uuid');
// const moment = require('moment');

const { logger } = require('../../config/logger');
const paymentUtils = require('../utils/payment.util');
const { targetUrl } = require('../../config/vars');

/*
const {
  Payment,
  Order,
} = global.sequelize;
*/

exports.callback = async (req, res, next) => {
  try {
    const payObj = await paymentUtils.updatePayment(req.body);
    return res.render('index', { targetUrl: `${targetUrl}/${payObj.paymentid}` });
  } catch (err) {
    logger.error('Item creation failed with ', err);
    return next(err);
  }
};
