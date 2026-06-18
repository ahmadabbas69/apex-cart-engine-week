const express = require('express');
const router = express.Router();
const { processCheckout } = require('../controllers/orderController');

router.post('/', processCheckout);

module.exports = router;