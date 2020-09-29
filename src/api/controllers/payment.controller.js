const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
// const { Op } = require('sequelize');
const moment = require('moment');
const {
  pick,
  orderBy,
} = require('lodash');

const { logger } = require('../../config/logger');
const paytmService = require('../services/paytm.service');

const {
  Order,
  Payment,
} = global.sequelize;


exports.createPayment = async (req, res, next) => {
  try {
    // const orderid = req.body.orderid;
    // validate
    const order = await Order.findOne({
      where: {
        orderid: req.body.orderid,
      },
      raw: true,
    });
    const crPayObj = {
      paymentid: uuidv4(),
      ...pick(req.body, ['orderid', 'provider']),
      amount: order.totalprice,
      status: 'CREATED',
    };
    await Payment.create(crPayObj);
    // now call paytm APIs
    const callParams = {
      ...pick(crPayObj, ['paymentid', 'orderid']),
      value: (order.totalprice).toString(),
    };
    const respObj = await paytmService.initTx(callParams);
    logger.info(respObj);
    await Payment.update({
      txntoken: respObj.body.txnToken,
    }, {
      where: { paymentid: crPayObj.paymentid },
    });
    const retPayObj = await Payment.findOne({
      where: { paymentid: crPayObj.paymentid },
      raw: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order created successfully',
      data: retPayObj,
    });
  } catch (err) {
    logger.error('Order creation failed with ', err);
    return next(err);
  }
};

exports.getPaymentByPaymentid = async (req, res, next) => {
  try {
    const { paymentid } = req.params;
    const payment = await Payment.findOne({
      where: { paymentid },
      raw: true,
    });
    if (payment.status === 'CREATED') {
      // check status
      const callParams = {
        ...pick(payment, ['paymentid', 'orderid']),
        value: (payment.amount).toString(),
        txnToken: payment.txntoken,
      };
      const respObj = await paytmService.getPaymentStatus(callParams);
      if (respObj.body.resultInfo.resultStatus === 'TXN_SUCCESS') {
        await Payment.update({
          status: 'SUCCESS',
          mode: respObj.body.paymentMode,
          recordedon: moment.now(),
        }, {
          where: { paymentid: payment.paymentid },
        });
        await Order.update({
          paystatus: 'PAID',
        }, {
          where: { orderid: payment.orderid },
        });
      }
    }
    const updPay = await Payment.findOne({
      where: { paymentid },
      raw: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order created successfully',
      data: updPay,
    });
  } catch (err) {
    logger.error('Order fetch failed with ', err);
    return next(err);
  }
};

exports.getPaymentByOrderid = async (req, res, next) => {
  try {
    const { orderid } = req.params;
    const payment = await Payment.findOne({
      where: { orderid },
      raw: true,
    });
    if (payment.status === 'CREATED') {
      // check status
      const callParams = {
        ...pick(payment, ['paymentid', 'orderid']),
        value: (payment.amount).toString(),
        txnToken: payment.txntoken,
      };
      const respObj = await paytmService.getPaymentStatus(callParams);
      if (respObj.body.resultInfo.resultStatus === 'TXN_SUCCESS') {
        await Payment.update({
          status: 'SUCCESS',
          mode: respObj.body.paymentMode,
          recordedon: moment.now(),
        }, {
          where: { paymentid: payment.paymentid },
        });
        await Order.update({
          paystatus: 'PAID',
        }, {
          where: { orderid: payment.orderid },
        });
      }
    }
    const updPay = await Payment.findOne({
      where: { orderid },
      raw: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order created successfully',
      data: updPay,
    });
  } catch (err) {
    logger.error('Order fetch failed with ', err);
    return next(err);
  }
};

exports.listPayment = async (req, res, next) => {
  try {
    const filterParams = { ...req.query };
    const payments = await Order.findAll({
      where: filterParams,
      raw: true,
    });
    const sortedList = orderBy(payments, ['recordedon'], ['desc']);
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order Listed successfully',
      data: sortedList,
    });
  } catch (err) {
    logger.error('Order list failed with ', err);
    return next(err);
  }
};

exports.editPayment = async (req, res, next) => {
  try {
    const { orderid } = req.params;
    const updObj = {
      ...pick(req.body, [
        'status',
      ]),
    };
    const orders = await Payment.update(updObj, {
      where: {
        orderid,
      },
      returning: true,
      plain: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order updated successfully',
      data: orders[1].dataValues,
    });
  } catch (err) {
    logger.error('Order update failed with ', err);
    return next(err);
  }
};

// exports.editOrderItem = async (req, res, next) => {};
