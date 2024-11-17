const Student = require('../models/studentModel');
const Marks = require('../models/marksModel');
const Profile = require('../models/profileModel');


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

const updateProfilePicture = async (req, res) => {
    try {
        const { admissionNumber } = req.params;
        const { profilePictureUrl } = req.body; // Accept profile picture URL

        if (!profilePictureUrl) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        const student = await Student.findOne({ admissionNumber });
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const profile = await Profile.findOne({ admissionNumber: student._id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.profilePicture = profilePictureUrl;
        await profile.save();

        const updatedProfileData = {
            ...profile.toObject(),
            name: student.name,
            email: student.student_email,
            admissionNumber: student.admissionNumber
        };

        res.status(200).json({ message: "Profile picture updated successfully", profile: updatedProfileData });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
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
    getStudentSubjects,
    updateProfilePicture
};