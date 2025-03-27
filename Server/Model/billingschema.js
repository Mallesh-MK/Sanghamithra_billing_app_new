const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  products: [
    {
      description: {
        type: String,
        enum: ['Frames', 'Glasses', 'Lenses'],
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    }
  ],
  contact: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Online'],
    required: true
  },
  finalTotal: {
    type: Number,
    required: true
  },
  qrCodeUrl: {
    type: String, // URL of the generated QR Code image
    default: ''
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
