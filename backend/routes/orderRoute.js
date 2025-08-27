const { placeOrder , getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");


//Place Order (public)
router.post('/', placeOrder);

// Get all orders (admin only)
router.get('/', verifyToken, isAdmin, getAllOrders);
router.get('/:id', verifyToken , isAdmin, getOrderById);

//Update status
router.patch('/:id/status', verifyToken, isAdmin, updateOrderStatus);


module.exports = router;
