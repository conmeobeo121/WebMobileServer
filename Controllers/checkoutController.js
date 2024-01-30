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

const handleLogin = async () => {
    try {
        let response = await postData('/auth/login', { email, password });
        console.log('Server Response:', response);

        if (response.token && response.role) {
            setToken(response, response.token, response.role);

            console.log('Token:', response.token);
            console.log('User:', response);

            if (response.role === ROLES.ADMIN) {
                navigate('/admin');
            } else if (response.role === ROLES.CUSTOMER) {
                navigate('/customer');
            }
        } else {
            console.error('Token or role is missing in the server response.');
        }
    } catch (error) {
        console.error(error);
        toast.error('Email or password is incorrect.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });
    }
};
const getCheckout_Total = async (req, res) => {
    try {
        const checkoutData = await Checkout.aggregate([
            {
                $unwind: '$products'
            },
            {
                $group: {
                    _id: '$products.product',
                    title: { $first: '$products.name' },
                    totalQuantity: { $sum: '$products.quantity' },
                    totalAmount: { $sum: '$products.price' },
                    startTime: { $min: '$createdAt' },  // Include the start time
                    endTime: { $max: '$createdAt' }      // Include the end time
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    totalQuantity: 1,
                    totalAmount: 1,
                    startTime: 1,
                    endTime: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalAllQuantity: { $sum: '$totalQuantity' },
                    totalAllAmount: { $sum: '$totalAmount' },
                    startTime: { $min: '$startTime' },  // Include the overall start time
                    endTime: { $max: '$endTime' }      // Include the overall end time
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAllQuantity: 1,
                    totalAllAmount: 1,
                    startTime: 1,
                    endTime: 1
                }
            }
        ]);

        res.status(200).json({ success: true, checkoutData });
    } catch (error) {
        console.error('Error fetching checkout data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { getCheckOut, getAllCheckouts, getCheckout_Total };