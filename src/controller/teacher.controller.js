const db = require("../model");
const security = require("../utils/security.js");
const Teacher = db.teacher;

// Create and Save a new Tutorial
exports.create = async(req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }
    
    const hashedPassword = await security.hashPassword(req.body.teacherPassword)
    // Create a Tutorial
    const teacher = new Teacher({
        teacherUsername: req.body.teacherUsername,
        teacherPassword: hashedPassword, // need to encrypt this later on
        teacherName: req.body.teacherName ,
        teacherEmail: req.body.teacherEmail ?? null,
        teacherPhone: req.body.teacherPhone ?? null,
        teacherBirthday: req.body.teacherBirthday ?? null,
        teacherStatus: 1, // always active
        teacherUsertype: req.body.teacherUsertype ?? 2, // default normal teacher, SU only created by developer
    });

    // Save teacher in the database
    teacher
        .save(teacher)
        .then(data => {
            res.status(200).send({
                statusMessage:
                    "Teacher " + req.body.teacherName + " has been created",
                statusCode: 0
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while creating the Teacher.",
                statusCode: -999,
            });
        });
};

// Retrieve all Teachers from the database.
exports.findAll = (req, res) => {
    const name = req.query.teacherName;
    var condition = name ? { teacherName: { $regex: new RegExp(title), $options: "i" } } : {};

    Teacher.find(condition)
        .then(data => {
            res.send({
                statusMessage: "Succeed at fetching all teachers",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the Teachers.",
                statusCode: -999,
            });
        });
};

// Find a single Teacher with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Teacher.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    statusMessage: "Not found teacher with id " + id,
                    statusCode: -999,
                });
            else {
                res.send({
                    statusMessage: "Succeed at fetching teacher " + data.teacherName,
                    statusCode: 0,
                    data: data
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    statusMessage: "Error retrieving teacher with id=" + id,
                    statusCode: -999,
                });
        });
};


exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }

    const id = req.params.id;

    Teacher.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    statusMessage: `Cannot update teacher with id=${id}. Maybe teacher was not found!`,
                    statusCode: -999
                });
            } else {
                res.send({
                    statusMessage: `Teacher ${data.teacherName} was updated successfully`,
                    statusCode: 0
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: "Error updating Teacher with id=" + id + ". Error : " + err.message,
                statusCode: -999
            });
        });
};

// Delete a Teacher with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Category.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    statusMessage: `Cannot delete teacher with id=${id}. Maybe teacher was not found!`,
                    statusCode: -999
                });
            } else {
                res.send({
                    statusMessage: "Teacher " + data.teacherName + " was deleted successfully!",
                    statusCode: 0
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: "Could not delete teacher with id=" + id,
                statusCode: -999
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Category.deleteMany({})
        .then(data => {
            res.send({
                statusMessage: `${data.deletedCount} teachers were successfully deleted!`,
                statusCode: 0
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage:
                    err.message || "Some error occurred while removing all teachers.",
                statusCode: -999
            });
        });
};

