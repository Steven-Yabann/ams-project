require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');
const libraryRoutes = require('./routes/library');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const calendarRoutes = require('./routes/calendar');
const feeRoutes = require('./routes/feeRoutes');


const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method, req.params, req.body);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/verify-fees', feeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/calendar', calendarRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to db & server");
        });
    })
    .catch((err) => {
        console.log(err);
    });
