const db = require("../model");
const trailersPathFolder = './assets/course/trailers/';
const thumbnailsPathFolder = './assets/course/thumbnails/';

// const pathFolder = 'D:/application-project/education-center/education-center-backend-node/NodeJS-education_center/assets/';
const fs = require('fs');
const path = require('path');

const course = db.course;
const Course = db.course;

// Create and Save a new course
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            statusMessage:
                "Content cannot be empty",
            statusCode: -999
        });
        return;
    }

    // Create a course
    const course = new Course({
        courseName: req.body.courseName,
        courseDescription: req.body.courseDescription ?? null,
        // courseFile: req.body.courseFile, // teralu gede untuk disimpen di db
        courseThumbnail: req.body.courseThumbnail ?? null,
        courseThumbnailName: req.body.courseThumbnailName ?? 'default-course-thumbnail.png',
        courseTrailercourseFile: req.body.courseTrailercourseFile ?? null,
        courseTrailercourseName: req.body.courseTrailercourseName ?? null,
        courseTotalBought: 0,
        courseMembership: req.body.courseMembership,
        coursePublished: req.body.coursePublished ?? false,
        courseTeacher: req.body.courseTeacher, //id tp pas get, fetch data nama teacher
    });

    const trailercourseBase64data = req.body.courseTrailercourseFile.replace(/^data:.*,/, '');
    const trailerThumbnailBase64data = req.body.courseThumbnail.replace(/^data:.*,/, '');
    fs.writeFile(trailersPathFolder + req.body.courseTrailercourseName, trailercourseBase64data, 'base64', (err) => {

        if (err) {
            res.status(500).send({
                statusMessage:
                    "Error while saving trailer course file : " + err.message,

                statusCode: -999
            });
            console.log(err);
        } else {
            // res.set('Location', userFiles + file.name);
            fs.writeFile(thumbnailsPathFolder + req.body.courseThumbnailName, trailerThumbnailBase64data, 'base64', (err) => {
                if (err) {
                    res.status(500).send({
                        statusMessage:
                            "Error while saving thumbnail file : " + err.message,
                        statusCode: -999
                    });
                    console.log(err);
                } else {

                    // Save Course in the database
                    course
                        .save(course)
                        .then(data => {
                            // res.send(data);
                            res.status(200).send({
                                statusMessage:
                                    "Course " + req.body.courseName + " had sucessfully created",
                                statusCode: 0
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                statusMessage: err.message || "Some error occurred while creating the Course.",
                                statusCode: -999,
                            });
                        });
                }
            });
        }
    });

};

// Retrieve all course from the database.
exports.findAll = (req, res) => {
    const courseName = req.query.courseName;
    var condition = courseName ? { courseName: { $regex: new RegExp(courseName), $options: "i" } } : {};

    course.find(condition)
        .then(data => {
            res.send({
                statusMessage: "Berhasil GET all courses",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the courses.",
                statusCode: -999,
            });
        });
};

// Retrieve all course from the database.
exports.findAllByTeacher = (req, res) => {
    const id = req.params.teacher_id;
    var condition = { courseTeacher: id };

    Course.find(condition)
        .then(data => {
            res.send({
                statusMessage: "Berhasil GET all courses",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the courses.",
                statusCode: -999,
            });
        });
};




// Find a single course with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    statusMessage: "Not found course with id " + id,
                    statusCode: -999,
                });
            else {
                res.send({
                    statusMessage: "Berhasil get course with id " + id,
                    statusCode: 0,
                    data: data
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    statusMessage: "Error retrieving course with id=" + id,
                    statusCode: -999,
                });
        });
};