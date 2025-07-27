const PaymentService = require('../services/paymentService');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res) => {
  const { amount, receipt } = req.body;
  const order = await PaymentService.createOrder(amount, receipt);
  res.status(200).json({ success: true, order });
});

exports.verifySignature = catchAsync(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const isValid = PaymentService.verifyPaymentSignature(orderId, paymentId, signature);
  res.status(200).json({ success: isValid });
});

exports.getPaymentDetails = catchAsync(async (req, res) => {
  const payment = await PaymentService.getPaymentDetails(req.params.id);
  res.status(200).json({ success: true, payment });
});

exports.refundPayment = catchAsync(async (req, res) => {
  const { paymentId, amount } = req.body;
  const refund = await PaymentService.refundPayment(paymentId, amount);
  res.status(200).json({ success: true, refund });
});

exports.getFrontendConfig = catchAsync(async (_req, res) => {
  const config = PaymentService.getFrontendConfig();
  res.status(200).json({ success: true, config });
});
