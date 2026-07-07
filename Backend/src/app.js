    // backend brain
    const express = require('express'); // import express tool
    const app = express(); // create an express app
    const authRoutes = require('./routes/authRoutes'); // import auth routes
    const productRoutes = require('./routes/productRoutes');// import product routes
    const categoryRoutes = require('./routes/categoryRoutes'); // import category
    const cors = require('cors'); // import cors
    
    
    app.use(cors({ origin: "http://localhost:5173", credentials: true }));
    app.use(express.json()); // enable json
    app.use('/auth', authRoutes);
    app.use('/products', productRoutes);
    app.use('/categories', categoryRoutes);
    app.get("/health", (req, res) => {
        res.json({ status: "ok", message: "Backend Running" });
    });
    app.get('/', (req, res) => {
        res.send('Server is running 🚀');
    });
    module.exports = app; // export for server.js to use
