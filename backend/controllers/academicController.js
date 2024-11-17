const Student = require('../models/studentModel');
const Marks = require('../models/marksModel');

// Get marks for a specific student
const getStudentMarks = async (req, res) => {
    try {
        const { studentId } = req.params;
        const marks = await Marks.find({ studentId: Number(studentId) });
        
        if (!marks) {
            return res.status(404).json({ message: 'No marks found for this student' });
        }

        // Calculate overall GPA
        const totalGPA = marks.reduce((acc, mark) => acc + mark.GPA, 0);
        const overallGPA = marks.length > 0 ? (totalGPA / marks.length).toFixed(2) : 0;

        // Group marks by subject
        const marksBySubject = marks.reduce((acc, mark) => {
            if (!acc[mark.subject]) {
                acc[mark.subject] = [];
            }
            acc[mark.subject].push(mark);
            return acc;
        }, {});

        res.status(200).json({ 
            marks: marksBySubject,
            overallGPA,
            rawMarks: marks 
        });
    } catch (error) {
        console.error('Error fetching student marks:', error);
        res.status(500).json({ message: 'Error fetching student marks' });
    }
};

// Get student profile
const getStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ admissionNumber: studentId });
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ message: 'Error fetching student profile' });
    }
};

// Get student's subjects
const getStudentSubjects = async (req, res) => {
    try {
        const { studentId } = req.params;
        const marks = await Marks.find({ studentId: Number(studentId) });
        const subjects = [...new Set(marks.map(mark => mark.subject))];
        
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching student subjects:', error);
        res.status(500).json({ message: 'Error fetching student subjects' });
    }
};

module.exports = {
    getStudentMarks,
    getStudentProfile,
    getStudentSubjects
};