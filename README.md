# 🛒 Apex Cart Engine 

A high-performance, enterprise-grade e-commerce cart management subsystem engineered to handle persistent product state transitions, dynamic discount calculations, and conditional shipping logistics.

---

## 🚀 Core Core Features

### 💾 Persistent Product Storage

- **Idempotent Schemas:** Products are backed by definitive, strict data schemas enforcing structural constraints for catalog items, base pricing, and real-time stock levels.
- **Relational Reference Mapping:** Utilizes normalization strategies to bind cart line-items directly to verified product database indices, guaranteeing real-time price updates sync dynamically across active sessions.

### 🏷️ Dynamic Discount Processing Engine

- **Server-Side Validation:** All promo code parameters are evaluated strictly on the backend layer to completely block any malicious frontend payload manipulation.
- **Tiered Coupon Calculations:** Supports rule-based markdown functions capable of evaluating percentage or flat-rate coupon codes against the active order basket.

### 🚚 Intelligent Logistics & Shipping Rules

- **Conditional Threshold Logic:** Dynamically calculates distribution and fulfillment overhead costs based on cumulative cart values.
- **Automated Free-Shipping Tiering:** Programmatically sets shipping fees to zero once the checkout subtotal crosses target order thresholds.

---

## 🛠️ Technology Stack

| Layer                   | Technology   | Purpose                                             |
| :---------------------- | :----------- | :-------------------------------------------------- |
| **Runtime Environment** | Node.js      | Non-blocking, event-driven backend execution        |
| **Backend Framework**   | Express.js   | High-performance HTTP routing & middleware pipeline |
| **Database Engine**     | MongoDB      | Highly scalable, document-oriented data persistence |
| **Data Modeling**       | Mongoose ODM | Object Data Modeling with strict schema validation  |

---

## 🏗️ Architectural Layout & File Structure

This platform utilizes a decoupled **Model-View-Controller (MVC)** architectural design pattern to guarantee clean isolation between network entry-points, business logic calculations, and database mutations.

```text
apex-cart-engine week 1/
├── 📁 config/          # Infrastructure configurations & DB handshake adapters
├── 📁 controllers/     # Core Business Logic Engines (Calculations, States, Cart actions)
├── 📁 models/          # Data Definition Layer (Strict Mongoose Schemas & Rules)
├── 📁 routes/          # Network Interface Layer (Express REST endpoints)
├── 📄 .env             # Application Environment Properties (Protected Local Context)
├── 📄 .gitignore       # Git tracking exclusion filters (Blocks node_modules & secrets)
├── 📄 package.json     # Node.js ecosystem dependencies & lifecycle scripts
└── 📄 server.js        # Main Application Gateway & Engine Bootstrapper
```
