const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discountPercentage: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        brand: { type: String },
        category: { type: String },
        images: { type: Array },
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
