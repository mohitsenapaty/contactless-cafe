const express = require('express');
const orderRoutes = require('./order.route');
const itemRoutes = require('./item.route');
const callbackRoutes = require('./callback.route');
const paymentRoutes = require('./payment.route');

const router = express.Router();

/**
 * API Routes
 */

router.use('/api/v1/order', orderRoutes);
router.use('/api/v1/item', itemRoutes);
router.use('/api/v1/callback', callbackRoutes);
router.use('/api/v1/payment', paymentRoutes);

module.exports = router;
