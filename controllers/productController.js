const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().select('name price stock category');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Item missing' });
        res.status(200).json({ success: true, message: 'Removed from index catalog' });
    } catch (err) { res.status(400).json({ success: false, message: 'Invalid entity reference structure' }); }
};