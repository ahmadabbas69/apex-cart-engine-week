const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Bind Active App Interfaces
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/checkout', require('./routes/orderRoutes'));

// Complete Interactive Client Frontend UI + Universal Generic Input Controls
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Apex Storefront Terminal v2.5</title>
        <style>
            :root {
                --bg-main: #0b0f19;
                --bg-card: #111827;
                --bg-input: #1f2937;
                --accent-blue: #3b82f6;
                --accent-purple: #a855f7;
                --accent-green: #10b981;
                --accent-orange: #f97316;
                --text-main: #f3f4f6;
                --text-muted: #6b7280;
                --border-color: #1f2937;
            }
            body {
                font-family: 'Segoe UI', system-ui, sans-serif;
                background-color: var(--bg-main);
                color: var(--text-main);
                margin: 0;
                padding: 40px 20px;
                display: flex;
                justify-content: center;
            }
            .app-container {
                max-width: 1300px;
                width: 100%;
            }
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 25px;
                margin-bottom: 35px;
            }
            h1 { margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(to right, #fff, #9ca3af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            
            .user-scope {
                display: flex;
                align-items: center;
                gap: 12px;
                background: var(--bg-card);
                padding: 8px 16px;
                border-radius: 10px;
                border: 1px solid var(--border-color);
            }
            .user-scope input {
                background: var(--bg-input);
                border: 1px solid var(--border-color);
                color: #fff;
                padding: 6px 10px;
                border-radius: 6px;
                width: 90px;
                font-weight: 700;
                text-align: center;
                outline: none;
            }

            .main-layout {
                display: grid;
                grid-template-columns: 0.9fr 1.3fr 1fr;
                gap: 25px;
                align-items: start;
            }
            .panel {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            h2 { margin-top: 0; font-size: 1.2rem; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
            
            .form-group { margin-bottom: 15px; }
            .form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
            .form-group input { width: 100%; box-sizing: border-box; background: var(--bg-input); border: 1px solid var(--border-color); color: #fff; padding: 10px 12px; border-radius: 8px; outline: none; font-size: 0.9rem; }
            .form-group input:focus { border-color: var(--accent-blue); }

            .products-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
            .product-card {
                background: rgba(31, 41, 55, 0.2);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: transform 0.2s, border-color 0.2s;
            }
            .product-card:hover { transform: translateY(-2px); border-color: rgba(59, 130, 246, 0.4); }
            .prod-tag { font-size: 0.7rem; background: rgba(168, 85, 247, 0.1); color: #c084fc; padding: 3px 8px; border-radius: 6px; width: max-content; margin-bottom: 8px; font-weight: 700; text-transform: uppercase; }
            .prod-meta h3 { margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 600; }
            .stock-display { font-size: 0.8rem; color: var(--text-muted); }
            .price-display { font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 8px; text-align: right; }
            
            button {
                background: var(--accent-blue);
                color: #fff;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background 0.2s, transform 0.1s;
            }
            button:hover { background: #2563eb; }
            button:active { transform: scale(0.97); }
            .btn-success { background: var(--accent-green); width: 100%; padding: 12px; font-size: 1rem; margin-top: 10px; }
            .btn-success:hover { background: #059669; }
            .btn-danger { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); padding: 5px 10px; font-size: 0.75rem; border-radius: 6px; }
            .btn-danger:hover { background: #ef4444; color: #fff; }

            .basket-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
            .basket-empty { color: var(--text-muted); text-align: center; padding: 40px 0; font-style: italic; font-size: 0.9rem; }
            
            .ledger-box { background: rgba(31, 41, 55, 0.15); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; margin-top: 20px; }
            .ledger-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; color: #9ca3af; }
            
            .rule-pill { font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; font-weight: 600; margin-bottom: 6px; display: inline-block; }
            .rule-shipping { background: rgba(249, 115, 22, 0.1); color: #ffedd5; border: 1px solid rgba(249, 115, 22, 0.2); }
            .rule-discount { background: rgba(168, 85, 247, 0.1); color: #f3e8ff; border: 1px solid rgba(168, 85, 247, 0.2); }
        </style>
    </head>
    <body>
        <div class="app-container">
            <header>
                <div>
                    <h1>Apex Storefront Terminal</h1>
                    <p style="color: var(--text-muted); margin: 5px 0 0 0;">Unified Control Matrix • Global Dynamic Database Pipeline</p>
                </div>
                <div class="user-scope">
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px;">SESSION USER ID:</span>
                    <input type="text" id="userScopeInput" value="u123" onchange="syncBasketSession()">
                </div>
            </header>

            <div class="main-layout">
                <div class="panel">
                    <h2 style="color: var(--accent-blue);">➕ Add New Product</h2>
                    <form id="productForm" onsubmit="executeProductInjection(event)">
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" id="prodName" placeholder="e.g., Gaming Laptop, Milk, Shirt" required>
                        </div>
                        <div class="form-group">
                            <label>Category (Type Anything)</label>
                            <input type="text" id="prodCategory" placeholder="e.g., Electronics, Food, Fashion" required>
                        </div>
                        <div class="form-group">
                            <label>Price (PKR)</label>
                            <input type="number" id="prodPrice" placeholder="5000" min="0" required>
                        </div>
                        <div class="form-group">
                            <label>Stock Quantity</label>
                            <input type="number" id="prodStock" placeholder="15" min="1" required>
                        </div>
                        <button type="submit" style="width: 100%; margin-top: 5px;">Inject into MongoDB</button>
                    </form>
                </div>

                <div class="panel">
                    <h2 style="color: var(--accent-green);">📦 Available Catalog Stock</h2>
                    <div id="productDeckWrapper" class="products-grid">
                        <p style="color: var(--text-muted);">Syncing catalog data channels...</p>
                    </div>
                </div>

                <div class="panel">
                    <h2 style="color: var(--accent-purple);">🛒 Realtime Customer Basket</h2>
                    <div id="basketItemsWrapper">
                        </div>

                    <div class="ledger-box">
                        <div class="ledger-row">
                            <span>Basket Subtotal:</span>
                            <span id="subtotalVal" style="font-weight: 700; color: #fff;">0 PKR</span>
                        </div>
                        <div style="margin-top: 15px; margin-bottom: 15px;">
                            <div class="rule-pill rule-shipping">🚚 Free Delivery Trigger &gt; 5,000 PKR</div>
                            <div class="rule-pill rule-discount">🎁 Loyalty Coupon Code Reward &gt; 7,000 PKR</div>
                        </div>
                        <button class="btn-success" onclick="executeCheckoutPipeline()">
                            Complete Order & Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            const host = window.location.origin;

            async function executeProductInjection(event) {
                event.preventDefault();
                
                const bodyData = {
                    name: document.getElementById('prodName').value,
                    category: document.getElementById('prodCategory').value,
                    price: Number(document.getElementById('prodPrice').value),
                    stock: Number(document.getElementById('prodStock').value)
                };

                try {
                    const res = await fetch(\`\${host}/api/products\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bodyData)
                    });
                    
                    const payload = await res.json();
                    if(payload.success) {
                        document.getElementById('productForm').reset();
                        pullCatalogFeed();
                    } else {
                        alert("Injection Error: " + payload.message);
                    }
                } catch (err) { console.error("Network Error:", err); }
            }

            async function pullCatalogFeed() {
                try {
                    const res = await fetch(\`\${host}/api/products\`);
                    const payload = await res.json();
                    const deck = document.getElementById('productDeckWrapper');
                    
                    if(!payload.data || payload.data.length === 0) {
                        deck.innerHTML = \`<p style="color: var(--text-muted); text-align: center; padding: 30px 0; font-style: italic;">No active products indexed. Use the left panel form to inject data directly into your database storage!</p>\`;
                        return;
                    }

                    deck.innerHTML = payload.data.map(prod => \`
                        <div class="product-card">
                            <div class="prod-meta">
                                <div class="prod-tag">\${prod.category}</div>
                                <h3>\${prod.name}</h3>
                                <span class="stock-display">Available Units: <strong style="color:#fff">\${prod.stock}</strong></span>
                            </div>
                            <div style="text-align: right;">
                                <div class="price-display">\${prod.price} PKR</div>
                                <button onclick="pushToBasket('\${prod._id}')" \text{\${prod.stock === 0 ? 'disabled style="background:#374151;color:#9ca3af;cursor:not-allowed;"' : ''}}>\text{\${prod.stock === 0 ? 'Out of Stock' : 'Add +'}}</button>
                            </div>
                        </div>
                    \`).join('');
                } catch (err) { console.error("Database connection fault:", err); }
            }

            async function syncBasketSession() {
                const uid = document.getElementById('userScopeInput').value;
                const wrapper = document.getElementById('basketItemsWrapper');
                const subtotalLabel = document.getElementById('subtotalVal');

                try {
                    const res = await fetch(\`\${host}/api/cart/\${uid}\`);
                    const payload = await res.json();

                    if (!payload.success || !payload.data || payload.data.items.length === 0) {
                        wrapper.innerHTML = \`<div class="basket-empty">Shopping basket empty. Add stock models to trigger cart arrays!</div>\`;
                        subtotalLabel.innerText = "0 PKR";
                        return;
                    }

                    subtotalLabel.innerText = \`\${payload.data.totalPrice} PKR\`;
                    wrapper.innerHTML = payload.data.items.map(item => \`
                        <div class="basket-item">
                            <div>
                                <div style="font-weight: 600; font-size:0.95rem;">\${item.productId ? item.productId.name : 'Unknown Product'}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top:3px;">\${item.price} PKR × \${item.quantity}</div>
                            </div>
                            <button class="btn-danger" onclick="dropFromBasket('\${item.productId._id || item.productId}')">Remove</button>
                        </div>
                    \`).join('');
                } catch (err) {
                    wrapper.innerHTML = \`<div class="basket-empty">Shopping basket empty. Add stock models to trigger cart arrays!</div>\`;
                    subtotalLabel.innerText = "0 PKR";
                }
            }

            async function pushToBasket(pid) {
                const uid = document.getElementById('userScopeInput').value;
                try {
                    const res = await fetch(\`\${host}/api/cart/add\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: uid, productId: pid, quantity: 1 })
                    });
                    const data = await res.json();
                    if(!data.success) alert(data.message);
                    syncBasketSession();
                } catch (err) { console.error(err); }
            }

            async function dropFromBasket(pid) {
                const uid = document.getElementById('userScopeInput').value;
                try {
                    await fetch(\`\${host}/api/cart/remove\`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: uid, productId: pid })
                    });
                    syncBasketSession();
                } catch (err) { console.error(err); }
            }

            async function executeCheckoutPipeline() {
                const uid = document.getElementById('userScopeInput').value;
                try {
                    const res = await fetch(\`\${host}/api/checkout\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: uid })
                    });
                    const payload = await res.json();

                    if(payload.success) {
                        const bill = payload.data;
                        alert(\`🎉 ORDER CHECKOUT COMPLETED SUCCESSFULLY!\\n\\n• Cart Total: \${bill.totalPrice} PKR\\n• Shipping Fee: \${bill.shippingFee === 0 ? 'FREE' : bill.shippingFee + ' PKR'}\\n• Loyalty Discount Applied: -\${bill.discount} PKR\\n\\n💰 TOTAL CHARGED PRICE: \${bill.finalPrice} PKR\`);
                        syncBasketSession();
                        pullCatalogFeed();
                    } else {
                        alert(payload.message);
                    }
                } catch (err) { console.error(err); }
            }

            pullCatalogFeed();
            syncBasketSession();
        </script>
    </body>
    </html>
    `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Operational on Core Channel Port ${PORT}`));