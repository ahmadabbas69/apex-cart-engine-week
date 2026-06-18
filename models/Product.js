const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Product name required'], trim: true },
    price: { type: Number, required: [true, 'Product price required'], min: 0 },
    stock: { type: Number, required: [true, 'Stock metrics required'], min: 0, default: 0 },
    category: { type: String, required: [true, 'Category specification required'], trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);