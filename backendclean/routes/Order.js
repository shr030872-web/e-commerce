const express = require("express"); 
const router = express.Router(); 
const Order = require("../models/Order");
// Place Order 
router.post("/", async (req, res) => {
     try { 
        const { userId, products, total } = req.body;
        const newOrder = new Order({ userId, products, total }); 
        await newOrder.save(); 
        res.json({ 
            message: "Order placed successfully " 

        });
    } 
     catch (err) { res.status(500).json({ 
        message: "Error placing order " 
        }); 
    } 
}); 

router.get("/ :userId", async (req, res) => {
     try { 
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders); 
    }
     catch (err) { 
        res.status(500).json({ 
            message: "Error fetching orders " 
        });
     }
}); 
     router.get("/", async (req, res) => {
        const orders = await Order.find();
        res.json(orders);
    });
    router.delete("/:id", async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
});
module.exports = router;