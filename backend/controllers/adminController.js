// controllers/adminController.js
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Fee = require('../models/fee');
const Marks = require('../models/marksModel');
const nodemailer = require('nodemailer');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Email setup - configure with your SMTP provider
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'glynn.tanui@strathmore.edu',
        pass: 'mplj uvur zzfw phpv'
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
        from: 'glynn.tanui@strathmore.edu', // sender address
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
        const { name, admissionNumber, student_email, gender } = req.body;

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
            gender,
        });

        // Create corresponding user document
        const newUser = new User({
            admissionNumber,
            password,
            gender,
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
        const { name, identification_no, email, phone_no, role, department, gender } = req.body;

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
            gender,
        });

        // Create corresponding user document
        const newUser = new User({
            admissionNumber: identification_no,
            password,
            userCategory: 'teacher',
            gender,
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

const getStudents = async (req, res) => {
    try {
        const students = await Student.find().select('name admissionNumber student_email gender');
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().select('name email phone_no role department gender');
        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Error fetching teachers" });
    }
};

const dashboardStats = async (req, res) => {
    try {
        const studentsCount = await Student.countDocuments();
        const teachersCount = await Teacher.countDocuments();
        const usersCount = await User.countDocuments();

        const booksTotal = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    totalBooks: { $sum: "$totalCopies" },
                },
            },
        ]);

        const totalBooks = booksTotal[0]?.totalBooks || 0; // Fallback to 0 if no books

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('admissionNumber userCategory createdAt');

        const totalFees = await Fee.aggregate([
            {
                $group: {
                    _id: null,
                    totalFeesCollected: { $sum: "$feesPaid" },
                    totalFeesExpected: { $sum: "$totalFees" },
                },
            },
        ]);

        const totalFeesCollected = totalFees[0]?.totalFeesCollected || 0;
        const totalFeesExpected = totalFees[0]?.totalFeesExpected || 0;
        const totalUnpaidFees = totalFeesExpected - totalFeesCollected; // Calculate unpaid fees

        const feeStats = {
            totalFeesCollected,
            totalUnpaidFees,
        };

        const paidCount = await Fee.countDocuments({ isCleared: true });
        const unpaidCount = await Fee.countDocuments({ isCleared: false });


        // Group student admissions by date
        const studentAdmissions = await Student.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Group teacher admissions by date
        const teacherAdmissions = await Teacher.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            studentsCount,
            teachersCount,
            usersCount,
            booksCount: totalBooks,
            recentUsers,
            feeStats,
            studentAdmissions,
            teacherAdmissions,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Error fetching dashboard statistics" });
    }
};

const getMarksData = async (req, res) => {
    try {
        const marksData = await Marks.aggregate([
            {
                $match: { typeofTest: "Exam" }, // Filter to include only Exams
            },
            {
                $group: {
                    _id: { typeofTest: "$typeofTest", subject: "$subject" },
                    averageMarks: { $avg: "$marks" },
                    highestMarks: { $max: "$marks" },
                    lowestMarks: { $min: "$marks" },
                },
            },
            {
                $sort: { "_id.subject": 1 }, // Sort by subject alphabetically
            },
        ]);
        console.log(marksData);
        res.status(200).json(marksData);
    } catch (error) {
        console.error("Error fetching marks data:", error);
        res.status(500).json({ message: "Error fetching marks data" });
    }
};

const getGenderDistribution = async (req, res) => {
    try {
        const genderData = await Student.aggregate([
            {
                $group: {
                    _id: "$gender", // Group by gender
                    count: { $sum: 1 }, // Count the number of students for each gender
                },
            },
        ]);

        res.status(200).json(genderData);
    } catch (error) {
        console.error("Error fetching gender distribution:", error);
        res.status(500).json({ message: "Error fetching gender distribution" });
    }
};


module.exports = { createStudent, createTeacher, getStudents, getTeachers, dashboardStats, getMarksData, getGenderDistribution };
