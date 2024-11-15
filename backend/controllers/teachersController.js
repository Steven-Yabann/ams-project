// controllers/teachersController.js
// const Teacher = require('../models/teacherModel');
const Marks = require('../models/marksModel');
const Attendance = require('../models/attendanceModel');
const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const Teacher = require("../models/teacherModel");

// Function to add marks
// Add or Update Marks
const addMarks = async (req, res) => {
    try {
        const { studentId, subject, marks, typeofTest } = req.body;

        // Calculate grade
        const calculateGrade = (marks) => {
            if (marks >= 70) return "A";
            if (marks >= 60) return "B";
            if (marks >= 50) return "C";
            if (marks >= 40) return "D";
            return "E";
        };

        // Calculate GPA (simple example for one entry)
        const calculateGPA = (grade) => {
            switch (grade) {
                case "A": return 4;
                case "B": return 3;
                case "C": return 2;
                case "D": return 1;
                default: return 0;
            }
        };

        const grade = calculateGrade(marks);
        const GPA = calculateGPA(grade);

        // Check if marks already exist for this student and subject
        let markEntry = await Marks.findOne({ studentId, subject });
        if (markEntry) {
            // Update existing entry
            markEntry.marks = marks;
            markEntry.grade = grade;
            markEntry.GPA = GPA;
            markEntry.typeofTest = typeofTest;
            await markEntry.save();
        } else {
            // Create new entry
            markEntry = new Marks({ studentId, subject, marks, grade, GPA, typeofTest });
            await markEntry.save();
        }

        res.status(200).json({ message: "Marks saved successfully", markEntry });
    } catch (error) {
        console.error("Error saving marks:", error);
        res.status(500).json({ message: "Error saving marks" });
    }
};

// Get all marks
const getMarks = async (req, res) => {
    try {
        const marks = await Marks.find({});
        res.status(200).json(marks);
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ message: "Error fetching marks" });
    }
};

// Delete marks
const deleteMarks = async (req, res) => {
    try {
        const { id } = req.params;
        await Marks.findByIdAndDelete(id);
        res.status(200).json({ message: "Marks deleted successfully" });
    } catch (error) {
        console.error("Error deleting marks:", error);
        res.status(500).json({ message: "Error deleting marks" });
    }
};

// Function to add attendance
const addAttendance = async (req, res) => {
    try {
        const { teacherId, students } = req.body; // Expect teacherId and students array

        // Validate input
        if (!teacherId || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid data provided' });
        }

        // Create attendance records for each student
        const attendanceRecords = students.map((student) => ({
            teacherId,
            studentId: student.admissionNo,
            date: new Date(), // Current date
            present: student.present,
        }));

        // Save all attendance records
        await Attendance.insertMany(attendanceRecords);

        res.status(201).json({ message: 'Attendance added successfully', attendance: attendanceRecords });
    } catch (error) {
        console.error('Error adding attendance:', error);
        res.status(500).json({ message: 'Error adding attendance', error });
    }
};


// Function to get teacher profile information
const getTeacherProfile = async (req, res) => {
    try {
        const { identification_no } = req.params; // Get identification number from URL params

        const profile = await Teacher.findOne({ identification_no }); // Fetch the teacher profile by identification number
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ profile }); // Return the profile data
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

const getAdmissionNumbers = async (req, res) => {
    try {
        const students = await Student.find({}, 'admissionNumber name'); // Fetch admission numbers and names
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching student admission numbers:', error);
        res.status(500).json({ message: 'Error fetching student admission numbers' });
    }
};

module.exports = {
    addMarks,
    getMarks,
    deleteMarks,
    addAttendance,
    getTeacherProfile,
    getCalenderDetails,
    getAdmissionNumbers
};
