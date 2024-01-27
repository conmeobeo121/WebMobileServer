const Checkout = require("../Models/checkOut");
const Product = require("../Models/productModel");


const getCheckOut = async (req, res) => {
    try {
        const { user, products, total } = req.body;

        const formattedProducts = products.map(product => ({
            product: product.product,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            images: product.images
        }));

        for (const product of formattedProducts) {
            const existingProduct = await Product.findById(product.product);

            if (!existingProduct) {
                return res.status(400).json({ success: false, message: `Product with id ${product.product} not found` });
            }

            // Giảm số lượng từ kho
            existingProduct.quantity -= product.quantity;
            await existingProduct.save();
        }

        const checkout = new Checkout({
            user,
            products: formattedProducts,
            total,
        });

        await checkout.save();

        res.status(200).json({ success: true, message: 'Checkout successful' });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



const getAllCheckouts = async (req, res) => {
    try {

        const checkouts = await Checkout.find().populate('user', 'name');

        res.status(200).json({ success: true, checkouts });
    } catch (error) {
        console.error('Error fetching checkouts:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = { getCheckOut, getAllCheckouts };
