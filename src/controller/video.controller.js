const db = require("../model");
const videosPathFolder = './assets/videos/';
const thumbnailsPathFolder = './assets/thumbnails/';

// const pathFolder = 'D:/application-project/education-center/education-center-backend-node/NodeJS-education_center/assets/';
const fs = require('fs');
const path = require('path');

const Video = db.video;

// Create and Save a new Video
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Video
    const video = new Video({
        title: req.body.title,
        description: req.body.description,
        videoFile: req.body.videoFile,
        videoThumbnail: req.body.videoThumbnail,
        videoFileName: req.body.videoFileName,
        videoThumbnailName: req.body.videoThumbnailName,
        category: req.body.category,
        published: false,
        membership: req.body.membership,
        totalViews: 0
    });

    const videoBase64data = req.body.videoFile.replace(/^data:.*,/, '');
    const thumbnailBase64data = req.body.videoThumbnail.replace(/^data:.*,/, '');
    fs.writeFile(videosPathFolder + req.body.videoFileName, videoBase64data, 'base64', (err) => {

        if (err) {
            console.log(err);
        } else {
            // res.set('Location', userFiles + file.name);
            fs.writeFile(thumbnailsPathFolder + req.body.videoThumbnailName, thumbnailBase64data, 'base64', (err) => {
                if (err) {
                    console.log(err);
                } else {

                    // Save Video in the database
                    video
                        .save(video)
                        .then(data => {
                            // res.send(data);
                            res.status(200).send({
                                statusMessage:
                                    "Sukses Membuat video",
                                statusCode: 0
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while creating the Video."
                            });
                        });
                }
            });
        }
    });

};
// Retrieve all Video from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Video.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving videos."
            });
        });
};
// Find a single Video with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Video.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Video with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Video with id=" + id });
        });
};

// Update a Video by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }



    const id = req.params.id;

    //delete video existing first
    Video.findById(id)
        .then(data => {
            // console.log(data)
            if (!data)
                res.status(404).send({ message: "Not found Video with id " + id });
            else {

                fs.unlink(videosPathFolder + data.videoFileName, (err) => {
                    if (err) {
                        res.status(500).send({
                            message:
                                "Error while deleting video file : " + err.message
                        });
                        console.log("Error while deleting video file : " + err);
                    } else {
                        // kalo sukses
                        // res.send(data);
                        fs.unlink(thumbnailsPathFolder + data.videoThumbnailName, (err) => {
                            if (err) {
                                res.status(500).send({
                                    message:
                                        "Error while deleting video thumbnail file : " + err.message
                                });
                                console.log("Error while deleting video thumbnail file : " + err);
                            } else {
                                Video.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                                    .then(data => {
                                        if (!data) {
                                            res.status(404).send({
                                                message: `Cannot update Video with id=${id}. Maybe Video was not found!`
                                            });
                                        } else {
                                            // setelah di delete filenya, baru save ulang
                                            const videoBase64data = req.body.videoFile.replace(/^data:.*,/, '');
                                            const thumbnailBase64data = req.body.videoThumbnail.replace(/^data:.*,/, '');
                                            fs.writeFile(videosPathFolder + req.body.videoFileName, videoBase64data, 'base64', (err) => {
                                                if (err) {
                                                    res.status(500).send({
                                                        message:
                                                            "Error while saving new video file : " + err.message
                                                    });
                                                    console.log("Error while saving new video file : " + err);
                                                } else {
                                                    // res.set('Location', userFiles + file.name);
                                                    fs.writeFile(thumbnailsPathFolder + req.body.videoThumbnailName, thumbnailBase64data, 'base64', (err) => {
                                                        if (err) {
                                                            res.status(500).send({
                                                                message:
                                                                    "Error while saving new thumbnail file : " + err.message
                                                            });
                                                            console.log("Error while saving new thumbnail file : " + err);
                                                        } else {
                                                            Video.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                                                                .then(data => {
                                                                    if (!data) {
                                                                        res.status(404).send({
                                                                            message: `Cannot update Video with id=${id}. Maybe Video was not found!`
                                                                        });
                                                                    } else res.send({ message: "Video was updated successfully." });
                                                                })
                                                                .catch(err => {
                                                                    res.status(500).send({
                                                                        message: "Error updating Tutorial with id=" + id
                                                                    });
                                                                });
                                                        }
                                                    });
                                                    // Save Video in the database

                                                }
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                            message: "Error updating Video with id=" + id
                                        });
                                    });
                            }
                        });

                    }
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Video with id=" + id });
        });


};

// Delete a Video with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Video.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Video with id=${id}. Maybe Video was not found!`
                });
            } else {
                fs.unlink(videosPathFolder + data.videoFileName, (err) => {
                    if (err) {
                        res.status(500).send({
                            message: "Cannot Delete video with id=" + id
                        });
                        console.log(err);
                    } else {
                        // kalo sukses
                        fs.unlink(thumbnailsPathFolder + data.videoThumbnailName, (err) => {
                            if (err) {
                                res.status(500).send({
                                    message: "Cannot Delete thumbnail video with id=" + id
                                });
                                console.log(err);
                            } else {
                                // kalo sukses
                                res.send({
                                    message: "Video was deleted successfully!"
                                });
                            }
                        });
                    }
                });


            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Could not delete Video with id=" + id
            });
        });
};

// Delete all Video from the database.
exports.deleteAll = (req, res) => {


    fs.readdir(videosPathFolder, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(videosPathFolder, file), err => {
                if (err) throw err;
            });
        }
    });

    fs.readdir(thumbnailsPathFolder, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(thumbnailsPathFolder, file), err => {
                if (err) throw err;
            });
        }
    });

    Video.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Videos were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Videos."
            });
        });
};

// Find all membership Video
exports.findAllMembership = (req, res) => {
    Video.find({ membership: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Videos."
            });
        });
};

// Find all Categoried Video
exports.findAllCategoried = (req, res) => {
    Video.find({ category: req.query.category })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Videos."
            });
        });
};