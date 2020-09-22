const express = require('express');
const orderRoutes = require('./order.route');
const itemRoutes = require('./item.route');

const router = express.Router();

/**
 * API Routes
 */

router.use('/api/v1/order', orderRoutes);
router.use('/api/v1/item', itemRoutes);

module.exports = router;
