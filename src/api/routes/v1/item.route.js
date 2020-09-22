const express = require('express');

const controller = require('../../controllers/item.controller');

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
  .post(controller.createItem);

router
  .route('/:itemid')
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
  .get(controller.getItem);

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
  .get(controller.listItem);

router
  .route('/:itemid')
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
  .patch(controller.editItem);


module.exports = router;
