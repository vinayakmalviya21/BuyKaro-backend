const express = require('express');
const { createOrder, getOrders } = require('../../controllers/order.controller.js');
const router = express.Router();

router.post('/', createOrder);

router.get('/', getOrders);

module.exports = router;
