const {
  Payment,
  Order,
} = global.sequelize;
// const { forEach, sortBy, filter } = require('lodash');
const moment = require('moment');
const { logger } = require('../../config/logger');

exports.updatePayment = async (params) => {
  logger.info('Finding investment chunks for investment id: ', params);
  if (params.STATUS === 'TXN_FAILURE') {
    await Payment.update({
      status: 'FAILED',
      recordedon: moment(params.TXNDATE),
      mode: params.PAYMENTMODE,
    }, {
      where: {
        paymentid: params.ORDERID,
      },
      returning: true,
      plain: true,
    });
  } else if (params.STATUS === 'TXN_SUCCESS') {
    await Payment.update({
      status: 'SUCCESS',
      recordedon: moment(params.TXNDATE),
      mode: params.PAYMENTMODE,
    }, {
      where: {
        paymentid: params.ORDERID,
      },
      returning: true,
      plain: true,
    });
  }
  const payment = await Payment.findOne({
    where: {
      paymentid: params.ORDERID,
    },
    raw: true,
  });
  if (payment.status === 'SUCCESS') {
    await Order.update({
      paystatus: 'PAID',
    }, {
      where: {
        orderid: payment.orderid,
      },
    });
  }
  return payment;
};
