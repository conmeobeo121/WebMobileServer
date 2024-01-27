const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema(
    {
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            name: String,
            quantity: Number,
            price: Number,
            images: Array,
        }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        total: Number,
        status: {
            type: String,
            enum: ['confirmed', 'pending'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Checkout = mongoose.model('CheckOut', checkoutSchema);

module.exports = Checkout;
