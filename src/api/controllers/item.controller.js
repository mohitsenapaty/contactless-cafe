const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
// const moment = require('moment');
const {
  pick,
} = require('lodash');

const { logger } = require('../../config/logger');

const {
  Item,
} = global.sequelize;

exports.createItem = async (req, res, next) => {
  try {
    const itemObj = {
      itemid: uuidv4(),
      ...pick(req.body, [
        'itemname',
        'price',
        'description',
        'picurl',
      ]),
      status: 'ACTIVE',
    };
    const creation = await Item.create(itemObj);
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Item created successfully',
      data: creation,
    });
  } catch (err) {
    logger.error('Item creation failed with ', err);
    return next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const { itemid } = req.params;
    const items = await Item.findOne({
      where: { itemid },
      raw: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Item found successfully',
      data: items,
    });
  } catch (err) {
    logger.error('Item get failed with ', err);
    return next(err);
  }
};

exports.listItem = async (req, res, next) => {
  try {
    const filterParams = { ...req.query };
    const items = await Item.findAll({
      where: filterParams,
      raw: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Item found successfully',
      data: items,
    });
  } catch (err) {
    logger.error('Item get failed with ', err);
    return next(err);
  }
};

exports.editItem = async (req, res, next) => {
  try {
    const { itemid } = req.params;
    const updObj = {
      ...pick(req.body, [
        'itemname',
        'price',
        'description',
        'picurl',
        'status',
      ]),
    };
    console.log(itemid, updObj);
    const items = await Item.update(updObj, {
      where: {
        itemid,
      },
      returning: true,
      plain: true,
    });
    console.log(items);
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Item found successfully',
      data: items[1].dataValues,
    });
  } catch (err) {
    logger.error('Item get failed with ', err);
    return next(err);
  }
};
