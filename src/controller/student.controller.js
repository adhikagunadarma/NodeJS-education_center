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

// Retrieve all students from the database.
exports.findAll = (req, res) => {
    const name = req.query.studentName;
    //only get active students for findall
    var condition = name ? { studentName: { $regex: new RegExp(title), $options: "i" },studentStatus : 1  } : { studentStatus : 1};

    Student.find(condition)
        .then(data => {
            res.send({
                statusMessage: "Succeed at fetching all students",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the students.",
                statusCode: -999,
            });
        });
};

// Find a single student with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Teacher.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    statusMessage: "Not found student with id " + id,
                    statusCode: -999,
                });
            else {
                res.send({
                    statusMessage: "Succeed at fetching student " + data.studentName,
                    statusCode: 0,
                    data: data
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    statusMessage: "Error retrieving student with id=" + id,
                    statusCode: -999,
                });
        });
};


//use for changing data basic, active, membership of student
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }

    const id = req.params.id;

    Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    statusMessage: `Cannot update student with id=${id}. Maybe student was not found!`,
                    statusCode: -999
                });
            } else {
                res.send({
                    statusMessage: `Student ${data.studentName} was updated successfully`,
                    statusCode: 0
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: "Error updating student with id=" + id + ". Error : " + err.message,
                statusCode: -999
            });
        });
};

