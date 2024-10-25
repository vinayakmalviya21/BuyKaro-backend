const jwt = require('jsonwebtoken'); 
const Order = require('../models/order.model');
const User = require('../models/user.model');

const createOrder = async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract data from the request body
        const { orderItems, shippingAddress, totalPrice } = req.body;

        // Create a new order with isPaid set to true and isDelivered set to "pending"
        const order = new Order({
            user: user._id, 
            orderItems,
            shippingAddress,
            totalPrice,
            isPaid: true,
            isDelivered: "pending", 
        });

        // Save the order to the database
        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all orders for the user
        const orders = await Order.find({ user: user._id }).populate('orderItems.product').populate('user');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders
};