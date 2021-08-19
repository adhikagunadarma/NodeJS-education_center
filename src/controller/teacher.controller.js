const db = require("../model");
const security = require("../utils/security.js");
const Teacher = db.teacher;

// Create and Save a new Teacher
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
    // Create a Teacher
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

    Teacher.findByIdAndRemove(id)
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

// Delete all Teachers from the database.
exports.deleteAll = (req, res) => {
    Teacher.deleteMany({})
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

// Login teacher
exports.login = async(req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }

    const username = req.body.teacherUsername;
    
    var condition =  { teacherUsername: username } ;

    Teacher.find(condition)
    // Teacher.find({}).select('teacherUsername teacherPassword -_id')
        .then(async(data) => {
            if (data.length === 0){
                res.status(404).send({
                    statusMessage: "Error Login, Not found teacher with teacherUsername " + username,
                    statusCode: -999,
                });
            }
           
            else {
                console.log(data)
                const checkPassword = await security.comparePassword(req.body.teacherPassword,data[0].teacherPassword)
           
                if (checkPassword){
                    res.send({
                    statusMessage: "Login Succeed",
                    statusCode: 0,
                    data: data
                });
                }
                else{
                    res.send({
                        statusMessage: "Login failed, please try again",
                        statusCode: -999,
                });
                }
            }
        })
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .send({
                    statusMessage: "Error retrieving teacher with username =" + username,
                    statusCode: -999,
                });
        });
    
 

};

exports.changePass = async(req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }
    
    const hashedPassword = await security.hashPassword(req.body.teacherPassword)
    
};

