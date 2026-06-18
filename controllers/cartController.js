const Cart = require('../models/Cart');
const Product = require('../models/Product');

const evaluateSum = (items) => items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const targetProduct = await Product.findById(productId);
        if (!targetProduct) return res.status(404).json({ success: false, message: 'Product missing' });
        if (targetProduct.stock < quantity) return res.status(400).json({ success: false, message: 'Stock shortfalls' });

        let userCart = await Cart.findOne({ userId });
        if (!userCart) {
            userCart = new Cart({
                userId,
                items: [{ productId, quantity, price: targetProduct.price }],
                totalPrice: targetProduct.price * quantity
            });
        } else {
            const matchIndex = userCart.items.findIndex(item => item.productId.toString() === productId);
            if (matchIndex > -1) {
                const combinedUnits = userCart.items[matchIndex].quantity + quantity;
                if (targetProduct.stock < combinedUnits) return res.status(400).json({ success: false, message: 'Exceeds store constraints' });
                userCart.items[matchIndex].quantity = combinedUnits;
            } else {
                userCart.items.push({ productId, quantity, price: targetProduct.price });
            }
            userCart.totalPrice = evaluateSum(userCart.items);
        }
        await userCart.save();
        res.status(200).json({ success: true, data: userCart });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getCart = async (req, res) => {
    try {
        const basket = await Cart.findOne({ userId: req.params.userId }).populate('items.productId', 'name category');
        if (!basket) return res.status(404).json({ success: false, message: 'No allocation found' });
        res.status(200).json({ success: true, data: basket });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const basket = await Cart.findOne({ userId });
        if (!basket) return res.status(404).json({ success: false, message: 'Missing record' });

        basket.items = basket.items.filter(item => item.productId.toString() !== productId);
        basket.totalPrice = evaluateSum(basket.items);
        await basket.save();
        res.status(200).json({ success: true, message: 'Item dropped from allocation tracking', data: basket });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};