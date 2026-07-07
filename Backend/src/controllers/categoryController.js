const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../models/categoryModel');

exports.getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await getCategoryById(id);
        if (!category) {
            return res.status(404).json({ messages: 'Category not found ' });
        }
        res.json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addCategory = async (req, res) => {
    const { name, description, image_url } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    try {
        const newCategory = await createCategory(name, description, image_url);
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.editCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'name is required' });
    }
    try {
        const updatedCategory = await updateCategory(id, { name, description, image_url });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// remove category
exports.removeCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteCategory(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Cannot delete category with existing products' });
        }
        res.status(500).json({ error: err.message });
    }
};
