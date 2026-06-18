const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.processCheckout = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentCart = await Cart.findOne({ userId });
        if (!currentCart || currentCart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Empty processing matrix' });
        }

        const baselineSum = currentCart.totalPrice;
        const shippingPremium = baselineSum > 5000 ? 0 : 200;
        const rewardDiscount = baselineSum > 7000 ? Math.round(baselineSum * 0.10) : 0;
        const statementValuation = baselineSum + shippingPremium - rewardDiscount;

        for (const unit of currentCart.items) {
            const productRecord = await Product.findById(unit.productId);
            if (!productRecord || productRecord.stock < unit.quantity) {
                return res.status(400).json({ success: false, message: 'Inventory conflicts occurred during validation' });
            }
            productRecord.stock -= unit.quantity;
            await productRecord.save();
        }

        const formalOrder = await Order.create({
            userId,
            items: currentCart.items,
            totalPrice: baselineSum,
            shippingFee: shippingPremium,
            discount: rewardDiscount,
            finalPrice: statementValuation
        });

        await Cart.findOneAndDelete({ userId });
        res.status(201).json({ success: true, message: 'Allocation cleared. Order initialized.', data: formalOrder });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};