const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    useId: {
        type: String,
        required: true
    },
    products: [
        {
            name: String,
            price: Number,
            qty: Number
        }
    ],
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);