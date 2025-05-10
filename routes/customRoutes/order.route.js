const express = require('express');
const { createOrder, getOrders ,createOrderPayment, verifyPayment } = require('../../controllers/order.controller.js');
const router = express.Router();

// router.post('/', createOrder);

router.get('/', getOrders);

router.post('/payment', createOrderPayment);

router.post('/verify-payment', verifyPayment);

module.exports = router;
