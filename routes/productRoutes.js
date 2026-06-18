const express = require('express');
const router = express.Router();
const { createProduct, getProducts, deleteProduct } = require('../controllers/productController');

router.route('/').post(createProduct).get(getProducts);
router.route('/:id').delete(deleteProduct);

module.exports = router;