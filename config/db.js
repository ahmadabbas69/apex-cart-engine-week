const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🟢 Database Linked Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`🔴 Connection Breakdown: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;