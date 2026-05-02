    // backend brain
    const express = require('express'); // import express tool
    const app = express(); // create an express app
    const authRoutes = require('./routes/authRoutes'); // import auth routes
    const cors = require('cors'); // import cors
    
    app.use(cors({ origin: "http://localhost:5174", credentials: true }));
    app.use(express.json()); // enable json
    app.use('/auth', authRoutes);

    app.get("/health", (req, res) => {
        res.json({ status: "ok", message: "Backend Running" });
    });
    app.get('/', (req, res) => {
        res.send('Server is running 🚀');
    });
    module.exports = app; // export for server.js to use