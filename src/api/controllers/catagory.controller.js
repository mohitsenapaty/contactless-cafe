const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
// const moment = require('moment');
const {
  pick,
} = require('lodash');

const { logger } = require('../../config/logger');

const {
  Catagory,
} = global.sequelize;

exports.createCatagory = async (req, res, next) => {
  try {
    const itemObj = {
      itemid: uuidv4(),
      ...pick(req.body, [
        'name',
        'description',
      ]),
      status: 'ACTIVE',
    };
    const creation = await Catagory.create(itemObj);
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

exports.getCatagory = async (req, res, next) => {
  try {
    const { name } = req.params;
    const cats = await Catagory.findOne({
      where: { name },
      raw: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Catagory found successfully',
      data: cats,
    });
  } catch (err) {
    logger.error('Catagory get failed with ', err);
    return next(err);
  }
};

exports.listCatagory = async (req, res, next) => {
  try {
    const filterParams = { ...req.query };
    const cats = await Catagory.findAll({
      where: filterParams,
      raw: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Catagory found successfully',
      data: cats,
    });
  } catch (err) {
    logger.error('Catagory get failed with ', err);
    return next(err);
  }
};

exports.editCatagory = async (req, res, next) => {
  try {
    const { name } = req.params;
    const updObj = {
      ...req.body,
    };
    const cat = await Catagory.update(updObj, {
      where: {
        name,
      },
      returning: true,
      plain: true,
    });
    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Catagory found successfully',
      data: cat[1].dataValues,
    });
  } catch (err) {
    logger.error('Catagory edit failed with ', err);
    return next(err);
  }
};
