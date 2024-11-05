// controllers/adminController.js
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

// Email setup - configure with your SMTP provider
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'stevekiptoo1@gmail.com',
        pass: 'tjupyferldmdkxjo'
    }
});

// Function to generate a random 6-character password
const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};

// Function to send an email
const sendEmail = async (email, admissionNumber, userCategory, password) => {
    const mailOptions = {
        from: 'stevekiptoo1@gmail.com', // sender address
        to: email, // receiver address
        subject: 'Account Created Successfully',
        text: `Hello,

Your ${userCategory} account has been successfully created. Here are your login details:

Username (Admission/Identification Number): ${email}
admission : ${admissionNumber}
Password: ${password}

Please make sure to change your password after logging in for the first time.

Best regards,
The Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
    }
};

const createStudent = async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        const { name, admissionNumber, student_email } = req.body;

        const existingUser = await User.findOne({ admissionNumber });
        const existingStudentEmail = await Student.findOne({ student_email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this admission number already exists" });
        }
        if (existingStudentEmail) {
            return res.status(400).json({ message: "Student with this email already exists" });
        }

        // Generate a random password
        const password = generatePassword();

        // Create student document
        const newStudent = new Student({
            name,
            admissionNumber,
            student_email,
        });

        // Create corresponding user document
        const newUser = new User({
            admissionNumber,
            password,
            userCategory: 'student',
        });

        await newStudent.save();
        await newUser.save();

        // Send email
        await sendEmail(student_email, admissionNumber, 'Student', password);

        res.status(201).json({ message: "Student created successfully", student: newStudent, generatedPassword: password });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        } else if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate key error", error });
        }
        res.status(500).json({ message: "Internal server error", error });
    }
};


// Function to create a teacher
const createTeacher = async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        const { name, identification_no, email, phone_no, role, department } = req.body;

        // Generate a random password
        const password = generatePassword();

        // Create teacher document
        const newTeacher = new Teacher({
            name,
            identification_no,
            email,
            phone_no,
            role,
            department,
        });

        // Create corresponding user document
        const newUser = new User({
            admissionNumber: identification_no,
            password,
            userCategory: 'teacher',
        });

        await newTeacher.save();
        await newUser.save();

        // Send email
        await sendEmail(email, identification_no, 'Teacher', password);

        res.status(201).json({ message: "Teacher created successfully", teacher: newTeacher, generatedPassword: password });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        } else if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate key error", error });
        }
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getStudent = async (req, res) => {
    res.json({ message: "Student response" });
};

const getTeacher = async (req, res) => {
    res.json({ message: "Teacher response" });
};

const dashboardStats = async (req, res) => {
    try {
        const studentsCount = await Student.countDocuments();
        const teachersCount = await Teacher.countDocuments();
        const usersCount = await User.countDocuments();

        // Fetch recent users (limit to the latest 10)
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('username email userCategory createdAt');

        res.json({ studentsCount, teachersCount, usersCount, recentUsers });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
};



module.exports = { createStudent, createTeacher, getStudent, getTeacher, dashboardStats };
