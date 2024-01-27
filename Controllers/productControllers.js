const productModel = require('../Models/productModel');

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getOneProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await productModel.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


const createOneProduct = async (req, res) => {
    try {
        const newProduct = await productModel.create(req.body);
        res.status(200).json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const updateOneProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const updateProduct = await productModel.updateOne({ id: productId }, { $set: req.body });
        if (updateProduct.n === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


const deleteOneProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const delProduct = await productModel.findOneAndDelete({ id: productId });
        if (!delProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product delete successfully' });

        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getAllProductsByCategory = async (req, res) => {
    const category = req.params.category; // Lấy category từ tham số trong URL
    try {
        const products = await productModel.find({ category: category });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found in category: ${category}` });
        }
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getAllProductsByRating = async (req, res) => {
    const rating = req.params.rating; // Lấy category từ tham số trong URL
    try {
        const products = await productModel.find({ rating: rating });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found in category: ${rating}` });
        }
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    getAllProducts,
    getOneProduct,
    createOneProduct,
    updateOneProduct,
    deleteOneProduct,
    getAllProductsByCategory,
    getAllProductsByRating
}

