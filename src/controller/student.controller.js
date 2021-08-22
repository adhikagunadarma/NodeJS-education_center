const db = require("../model");
const security = require("../utils/security.js");
const Student = db.student;

// Create and Save a new student
exports.create = async(req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }
    
    const hashedPassword = await security.hashPassword(req.body.studentPassword)
    // Create a Teacher
    const student = new Student({
        studentUsername: req.body.studentUsername,
        studentPassword: hashedPassword, 
        studentName: req.body.studentName ,
        studentEmail: req.body.studentEmail ?? null,
        studentPhone: req.body.studentPhone ?? null,
        studentBirthday: req.body.studentBirthday ?? null,
        studentStatus: 1, // always active
        studentMembership: 0 // default not membership yet
    });

    // Save teacher in the database
    student
        .save(student)
        .then(data => {
            res.status(200).send({
                statusMessage:
                    "Student " + req.body.studentName + " has been created",
                statusCode: 0
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while creating the Student.",
                statusCode: -999,
            });
        });
};