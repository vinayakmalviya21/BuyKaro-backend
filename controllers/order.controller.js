const jwt = require("jsonwebtoken");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const instance = require("../razorpay");

const createOrder = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    res
      .status(500)
      .json({ message: "Error placing order", error: error.message });
  }
};
const createOrderPayment = async (req, res) => {
  const totalPrice = req.body.totalPrice * 100;

  const options = {
    amount: totalPrice,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  // create order
  try {
    const paymentResponse = await instance.orders.create(options);
    const { orderItems, shippingAddress, totalPrice } = req.body;

    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log("Error in payment capture section: ", error);
    res.status(500).json({
      success: false,
      message: "Could Not Initiate Order",
      error: error.description,
    });
  }
};

const verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;

  const products = req.body?.products;
  const userId = req.body?.id;
  const email = req.body?.email;

  // validation
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !products ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  //Payment Verification Logic
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const order = await Order.create({
        orderItems: products,
        user: userId,
        isPaid: true,
        isDelivered: "pending",
        email,
      });
      return res
        .status(200)
        .json({ success: true, message: "Payment Verified" });
    } catch (error) {
      console.log("Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Payment Failed to Verify" });
    }
  }

  return res
    .status(500)
    .json({ success: false, message: "Payment Failed to Verify" });
};

const getOrders = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all orders for the user
    const orders = await Order.find({ user: user._id })
      .populate("orderItems.product")
      .populate("user");

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  createOrderPayment,
  verifyPayment,
};
