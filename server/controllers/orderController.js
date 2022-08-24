const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions, sendOrderSuccessEmail } = require('../utils');

// const fakeStripeAPI = async ({ amount, currency }) => {
//   const client_secret = 'someRandomValue';
//   return { client_secret, amount };
// };

const createOrder = async (req, res) => {
  const { cartItems, fullAddress: address } = req.body;
  const userId = req.user.userId;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  const user = await User.findOne({ _id: userId });

  let orderItems = [];
  let subtotal = 0;
  let shippingFee = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.id });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id : ${item.id}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
    shippingFee += item.amount * 20000;
  }
  // calculate total
  const total = shippingFee + subtotal;
  // get client secret
  // const paymentIntent = await fakeStripeAPI({
  //   amount: total,
  //   currency: 'usd',
  // });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    address,
    shippingFee,
    // clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  await sendOrderSuccessEmail({
    name: user.name,
    email: user.email,
    total: total / 100,
  });

  res.status(StatusCodes.CREATED).json({ order });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
