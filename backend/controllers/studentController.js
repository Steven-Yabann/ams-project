const Student = require("../models/studentModel");

const getStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ message: "Error fetching students" });
    }
};

module.exports = { getStudents };
