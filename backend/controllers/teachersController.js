// controllers/teachersController.js
// const Teacher = require('../models/teacherModel');
const Marks = require('../models/marksModel');
const Attendance = require('../models/attendanceModel');
const mongoose = require('mongoose');

// Separate DB connection for profile information
const profileDB = mongoose.createConnection('mongodb://<profileDB_URI>', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const TeacherProfile = profileDB.model('TeacherProfile', new mongoose.Schema({
    name: String,
    identification_no: Number,
    email: String,
    phone_no: Number,
    role: String,
    department: String,
}, { timestamps: true }));

// Function to add marks
const addMarks = async (req, res) => {
    try {
        const { admn, subject, marks, GPA, typeOfTest } = req.body;

        const newMarks = new Marks({
            admn,
            subject,
            marks,
            GPA,
            typeOfTest,
            grade,
        });

        await newMarks.save();
        res.status(201).json({ message: 'Marks added successfully', marks: newMarks });
    } catch (error) {
        res.status(500).json({ message: 'Error adding marks', error });
    }
};

// Function to add attendance
const addAttendance = async (req, res) => {
    try {
        const { admn, status } = req.body;

        const newAttendance = new Attendance({
            admn,
            status,
            date,
        });

        await newAttendance.save();
        res.status(201).json({ message: 'Attendance added successfully', attendance: newAttendance });
    } catch (error) {
        res.status(500).json({ message: 'Error adding attendance', error });
    }
};

// Function to get teacher profile information
const getTeacherProfile = async (req, res) => {
    try {
        const { identification_no } = req.params;

        const profile = await TeacherProfile.findOne({ identification_no });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ profile });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teacher profile', error });
    }
};

const getCalenderDetails = async (req, res) => {
    try {
        const { identification_no } = req.params;

        const profile = await CalenderDetails.findOne({ identification_no });
        if (!calender) {
            return res.status(404).json({ message: 'calender not found' });
        }

        res.json({ profile });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching calender', error });
    }
};

module.exports = {
    addMarks,
    addAttendance,
    getTeacherProfile,
    getCalenderDetails,
};
