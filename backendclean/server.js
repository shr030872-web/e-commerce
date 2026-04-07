const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("dns").setDefaultResultOrder("ipv4first");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const productRoutes = require("./routes/Product");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/Order"); 

app.use("/api/Products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/Orders", orderRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("My server is running ");
});

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("DB Error:", err));

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});