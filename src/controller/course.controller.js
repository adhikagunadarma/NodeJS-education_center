const db = require("../model");
const trailersPathFolder = './assets/course/trailers/';
const thumbnailsPathFolder = './assets/course/thumbnails/';

// const pathFolder = 'D:/application-project/education-center/education-center-backend-node/NodeJS-education_center/assets/';
const fs = require('fs');
const path = require('path');

const Video = db.video;
const Course = db.course;

// Create and Save a new Video
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

    // Create a Video
    const course = new Course({
        courseName: req.body.courseName,
        courseDescription: req.body.courseDescription ?? null,
        // videoFile: req.body.videoFile, // teralu gede untuk disimpen di db
        courseThumbnail: req.body.courseThumbnail ?? null,
        courseThumbnailName: req.body.courseThumbnailName ?? 'default-course-thumbnail.png',
        courseTrailerVideoFile: req.body.courseTrailerVideoFile ?? null,
        courseTrailerVideoName: req.body.courseTrailerVideoName ?? null,
        courseTotalBought: 0,
        courseMembership: req.body.courseMembership,
        coursePublished: req.body.coursePublished ?? false,
        courseTeacher: req.body.courseTeacher, //id tp pas get, fetch data nama teacher
    });

    const trailerVideoBase64data = req.body.courseTrailerVideoFile.replace(/^data:.*,/, '');
    const trailerThumbnailBase64data = req.body.courseThumbnail.replace(/^data:.*,/, '');
    fs.writeFile(trailersPathFolder + req.body.courseTrailerVideoName, trailerVideoBase64data, 'base64', (err) => {

        if (err) {
            res.status(500).send({
                statusMessage:
                    "Error while saving trailer video file : " + err.message,

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
