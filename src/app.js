    // backend brain
    const express = require('express'); // import express tool
    const app = express(); // create an express app
    app.use(express.json()); // enable json

    app.get("/health", (req, res) => {
        res.json({ status: "ok", message: "Backend Running" });
    });
    app.get('/', (req, res) => {
        res.send('Server is running 🚀');
    });
    module.exports = app; // export for server.js to use