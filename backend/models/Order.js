const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      figurineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Figurine', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    }
  ],
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
