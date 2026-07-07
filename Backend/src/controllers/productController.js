const {getAllProductsByCategory, getProductById, createProduct, updateProduct, toggleProductAvailability, deleteProduct: deleteProductFromDb} = require('../models/productModel');
// get products 
exports.getProductsByCategory = async(req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await getAllProductsByCategory(categoryId);
        res.json({ products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};  
// get product by id 
exports.getProduct = async(req, res) => {
    const { id } = req.params;
    try {
        const product = await getProductById(id);
        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addProduct = async(req, res) => {
    const { category_id, name, description, price, image_url } = req.body;
      if (!category_id || !name || !price) {
        return res.status(400).json({ message: 'category_id, name, and price are required' });
    }
     if (Number(price) <= 0) {
        return res.status(400).json({ message: 'price must be greater than 0' });
    }
    try {
        const newProduct = await createProduct(category_id, name, description, price, image_url);
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.editProduct = async(req, res) => {
    const { id } = req.params;
    const { category_id, name, description, price, image_url } = req.body;
    if (!category_id || !name || !price) {
        return res.status(400).json({ message: 'category_id, name, and price are required' });
    }

    if (Number(price) <= 0) {
        return res.status(400).json({ message: 'price must be greater than 0' });
    }

    try {
        const updatedProduct = await updateProduct(id,{ category_id, name, description, price, image_url });
        if(!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.changeProductAvailability = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await toggleProductAvailability(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product availability updated successfully',
            product
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteProductFromDb(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            message: 'Product deleted successfully',
            product: deleted
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
