const Student= require('../models/studentModel');
const Teacher= require('../models/teacherModel')

// Function to create a student
const createStudent = async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        const { name, adm_no, student_identification, student_email, mother_name, father_name, mother_id, father_id, mother_email, father_email } = req.body;
        
        const newStudent = new Student({
            name,
            adm_no,
            student_identification,
            student_email,
            mother_name,
            father_name,
            mother_id,
            father_id,
            mother_email,
            father_email,
        });

        await newStudent.save();
        res.status(201).json({ message: "Student created successfully", student: newStudent });
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
    res.json({mssg: "Student response"})
}

// Function to create a teacher
const createTeacher = async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        const { name, identification_no, email, phone_no, role, department } = req.body;
        
        const newTeacher = new Teacher({
            name,
            identification_no,
            email,
            phone_no,
            role,
            department,
        });

        await newTeacher.save();
        res.status(201).json({ message: "Teacher created successfully", teacher: newTeacher });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.errors });
        } else if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate key error", error });
        }
        res.status(500).json({ message: "Internal server error", error });
    }
};


const getTeacher = async (req, res) => {
    res.json({mssg: "Teacher response"})
}

module.exports = { createStudent, createTeacher, getStudent, getTeacher };
