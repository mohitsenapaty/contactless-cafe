const express = require('express');

const controller = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/rules/add Add
   * @apiDescription Add rules
   * @apiVersion 1.0.0
   * @apiName Add rules
   * @apiGroup rules
   *
   * @apiHeader {String} Authorization  None
   *
   * @apiSuccess {Object} Status and Message
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated data can access the data
   * @apiError (Forbidden 403)     Forbidden
   */
  .post(controller.createOrder);

router
  .route('/:orderid')
  /**
   * @api {post} api/v1/rules/add Add
   * @apiDescription Add rules
   * @apiVersion 1.0.0
   * @apiName Add rules
   * @apiGroup rules
   *
   * @apiHeader {String} Authorization  None
   *
   * @apiSuccess {Object} Status and Message
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated data can access the data
   * @apiError (Forbidden 403)     Forbidden
   */
  .get(controller.getOrder);

router
  .route('/')
  /**
   * @api {post} api/v1/rules/add Add
   * @apiDescription Add rules
   * @apiVersion 1.0.0
   * @apiName Add rules
   * @apiGroup rules
   *
   * @apiHeader {String} Authorization  None
   *
   * @apiSuccess {Object} Status and Message
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated data can access the data
   * @apiError (Forbidden 403)     Forbidden
   */
  .get(controller.listOrder);

router
  .route('/:orderid')
  /**
   * @api {post} api/v1/rules/add Add
   * @apiDescription Add rules
   * @apiVersion 1.0.0
   * @apiName Add rules
   * @apiGroup rules
   *
   * @apiHeader {String} Authorization  None
   *
   * @apiSuccess {Object} Status and Message
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated data can access the data
   * @apiError (Forbidden 403)     Forbidden
   */
  .patch(controller.editOrder);

router
  .route('/:orderid/orderitems/:orderitemid')
  /**
   * @api {post} api/v1/rules/add Add
   * @apiDescription Add rules
   * @apiVersion 1.0.0
   * @apiName Add rules
   * @apiGroup rules
   *
   * @apiHeader {String} Authorization  None
   *
   * @apiSuccess {Object} Status and Message
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated data can access the data
   * @apiError (Forbidden 403)     Forbidden
   */
  .patch(controller.editOrderItems);


module.exports = router;
