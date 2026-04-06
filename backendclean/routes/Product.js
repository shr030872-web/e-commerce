const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});
router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});
// ADD PRODUCT
router.post("/", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json({ message: "Product added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding product" });
    }
});
// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

module.exports = router;