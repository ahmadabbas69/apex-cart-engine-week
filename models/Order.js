const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: Array,
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    discount: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    status: { type: String, default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);