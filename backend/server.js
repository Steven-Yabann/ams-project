require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');
const libraryRoutes = require('./routes/library');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

// express app
const app = express();

// middleware
app.use(cors()); // Enable CORS
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/admin', adminRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to db & server");
        });
    })
    .catch((err) => {
        console.log(err);
    });
