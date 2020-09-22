const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
// const { Op } = require('sequelize');
// const moment = require('moment');
const {
  pick,
  map,
  each,
  remove,
  groupBy,
  isEmpty,
} = require('lodash');

const { logger } = require('../../config/logger');

const {
  Order,
  Item,
  Orderitem,
} = global.sequelize;

const getTotalOrderPrice = (items) => {
  let sum = 0;
  each(items, (item) => {
    // eslint-disable-next-line no-param-reassign
    item.totalprice = item.quantity * item.price;
    sum += item.totalprice;
  });
  return sum;
};

exports.createOrder = async (req, res, next) => {
  try {
    const itemList = req.body.items;
    // validate
    let isValidOrder = true;
    const validItems = [];
    await Promise.each(itemList, async (item) => {
      const objPresent = await Item.findOne({ where: { itemid: item.itemid } });
      if (!objPresent) isValidOrder = false;
      objPresent.quantity = item.quantity;
      // eslint-disable-next-line no-param-reassign
      item.totalprice = objPresent.quantity * objPresent.price;
      validItems.push(objPresent);
    });
    if (!isValidOrder) {
      return res.status(httpStatus.OK).json({
        code: httpStatus.BAD_REQUEST,
        message: 'Some item is not valid',
      });
    }
    const orderObj = {
      orderid: uuidv4(),
      ...pick(req.body, [
        'customername',
        'customerphone',
        'tableid',
      ]),
      totalprice: getTotalOrderPrice(validItems),
      status: 'CREATED',
    };
    const createdOrder = await Order.create(orderObj);
    const returnOrder = createdOrder.dataValues;
    const orderItems = map(itemList, (il) => ({
      orderitemid: uuidv4(),
      orderid: orderObj.orderid,
      itemid: il.itemid,
      quantity: il.quantity,
      totalprice: il.totalprice,
      status: 'ACTIVE',
    }));
    const createdItems = await Orderitem.bulkCreate(orderItems, { returning: true });
    remove(orderItems, (oi) => (oi.status === 'CANCELLED'));
    returnOrder.orderitems = createdItems;
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order created successfully',
      data: returnOrder,
    });
  } catch (err) {
    logger.error('Order creation failed with ', err);
    return next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { orderid } = req.params;
    const order = await Order.findOne({
      where: { orderid },
      raw: true,
    });
    const orderItems = await Orderitem.findAll({
      where: { orderid },
      raw: true,
    });
    const allItems = await Item.findAll();
    const itemGroup = groupBy(allItems, 'itemid');
    remove(orderItems, (oi) => (oi.status === 'CANCELLED'));
    each(orderItems, (oi) => {
      if (!isEmpty(itemGroup[oi.itemid])) {
        const [item] = itemGroup[oi.itemid];
        // eslint-disable-next-line no-param-reassign
        oi.item = item;
      }
    });
    order.orderitems = orderItems;
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order created successfully',
      data: order,
    });
  } catch (err) {
    logger.error('Order fetch failed with ', err);
    return next(err);
  }
};

exports.listOrder = async (req, res, next) => {
  try {
    const filterParams = { ...req.query };
    const orders = await Order.findAll({
      where: filterParams,
      raw: true,
    });
    const allItems = await Item.findAll({ raw: true });
    const itemGroup = groupBy(allItems, 'itemid');
    const orderList = await Promise.map(orders, async (order) => {
      const orderItems = await Orderitem.findAll({
        where: { orderid: order.orderid },
        raw: true,
      });
      remove(orderItems, (oi) => (oi.status === 'CANCELLED'));
      each(orderItems, (oi) => {
        if (!isEmpty(itemGroup[oi.itemid])) {
          const [item] = itemGroup[oi.itemid];
          // eslint-disable-next-line no-param-reassign
          oi.item = item;
        }
      });
      // eslint-disable-next-line no-param-reassign
      order.orderitems = orderItems;
      return order;
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order Listed successfully',
      data: orderList,
    });
  } catch (err) {
    logger.error('Order list failed with ', err);
    return next(err);
  }
};

exports.editOrder = async (req, res, next) => {
  try {
    const { orderid } = req.params;
    const updObj = {
      ...pick(req.body, [
        'status',
      ]),
    };
    console.log(orderid, updObj);
    const orders = await Order.update(updObj, {
      where: {
        orderid,
      },
      returning: true,
      plain: true,
    });
    console.log(orders);
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

exports.editOrderItems = async (req, res, next) => {
  try {
    const { orderid, orderitemid } = req.params;
    const order = await Order.findOne({
      where: { orderid },
      raw: true,
    });
    const updObj = {
      ...pick(req.body, [
        'status',
      ]),
    };
    await Orderitem.update(updObj, {
      where: {
        orderitemid,
      },
    });
    // update order
    const orderItems = await Orderitem.findAll({
      where: {
        orderid,
      },
      raw: true,
    });
    remove(orderItems, (item) => (item.status === 'CANCELLED'));
    let newTotal = 0;
    each(orderItems, (oi) => {
      newTotal += oi.totalprice;
    });
    await Order.update({
      totalprice: newTotal,
      status: (newTotal === 0) ? 'CANCELLED' : order.status,
    }, {
      where: { orderid: order.orderid },
    });
    order.totalprice = newTotal;
    order.orderitems = orderItems;
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Order Listed successfully',
      data: order,
    });
  } catch (err) {
    logger.error('Order edit failed with ', err);
    return next(err);
  }
};

// exports.editOrderItem = async (req, res, next) => {};
