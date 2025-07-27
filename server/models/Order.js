const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    street: { 
      type: String, 
      required: [true, 'Street address is required'] 
    },
    city: { 
      type: String, 
      required: [true, 'City is required'] 
    },
    state: { 
      type: String, 
      required: [true, 'State is required'] 
    },
    zipCode: { 
      type: String, 
      required: [true, 'ZIP code is required'] 
    },
    phone: { 
      type: String, 
      required: [true, 'Phone number is required'] 
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentResult: {
    razorpayOrderId: {
      type: String,
      required: true
    },
    razorpayPaymentId: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    update_time: {
      type: Date
    }
  },
  shippedAt: Date,
  totalAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  deliveredAt: Date,
  isDelivered: { type: Boolean, default: false },
  paidAt: Date,
//   timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
}, { timestamps: true }
);


// Virtual for order total
orderSchema.virtual('orderTotal').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 