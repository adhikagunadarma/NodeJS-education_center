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
        res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
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
            res.status(500).send({
                statusMessage:
                    "Error while saving video file : " + err.message,

                statusCode: -999
            });
            console.log(err);
        } else {
            // res.set('Location', userFiles + file.name);
            fs.writeFile(thumbnailsPathFolder + req.body.videoThumbnailName, thumbnailBase64data, 'base64', (err) => {
                if (err) {
                    res.status(500).send({
                        statusMessage:
                            "Error while saving thumbnail file : " + err.message,
                        statusCode: -999
                    });
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
                                statusMessage: err.message || "Some error occurred while creating the Video.",
                                statusCode: -999,
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
            res.send({
                statusMessage: "Berhasil GET all Videos",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the Video.",
                statusCode: -999,
            });
        });
};
// Find a single Video with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Video.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    statusMessage: "Not found Video with id " + id,
                    statusCode: -999,
                });
            else {
                res.send({
                    statusMessage: "Berhasil get Video with id " + id,
                    statusCode: 0,
                    data: data
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    tatusMessage: "Error retrieving Video with id=" + id,
                    statusCode: -999,
                });
        });
};

// Update a Video by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }



    const id = req.params.id;

    //delete video existing first
    Video.findById(id)
        .then(data => {
            // console.log(data)
            if (!data)
                res.status(404).send({
                    statusMessage:
                        "Not found Video with id " + id,
                    statusCode: -999
                });
            else {

                fs.unlink(videosPathFolder + data.videoFileName, (err) => {
                    if (err) {
                        res.status(500).send({
                            statusMessage:
                                "Error while deleting video file : " + err.message,
                            statusCode: -999
                        });
                        console.log("Error while deleting video file : " + err);
                    } else {
                        // kalo sukses
                        // res.send(data);
                        fs.unlink(thumbnailsPathFolder + data.videoThumbnailName, (err) => {
                            if (err) {
                                res.status(500).send({
                                    statusMessage:
                                        "Error while deleting video thumbnail file : " + err.message,
                                    statusCode: -999
                                });
                                console.log("Error while deleting video thumbnail file : " + err);
                            } else {
                                Video.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                                    .then(data => {
                                        if (!data) {
                                            res.status(404).send({
                                                statusMessage: `Cannot update Video with id=${id}. Maybe Video was not found!`,
                                                statusCode: -999
                                            });
                                        } else {
                                            // setelah di delete filenya, baru save ulang
                                            const videoBase64data = req.body.videoFile.replace(/^data:.*,/, '');
                                            const thumbnailBase64data = req.body.videoThumbnail.replace(/^data:.*,/, '');
                                            fs.writeFile(videosPathFolder + req.body.videoFileName, videoBase64data, 'base64', (err) => {
                                                if (err) {
                                                    res.status(500).send({
                                                        statusMessage:
                                                            "Error while saving new video file : " + err.message,
                                                        statusCode: -999
                                                    });
                                                    console.log("Error while saving new video file : " + err);
                                                } else {
                                                    // res.set('Location', userFiles + file.name);
                                                    fs.writeFile(thumbnailsPathFolder + req.body.videoThumbnailName, thumbnailBase64data, 'base64', (err) => {
                                                        if (err) {
                                                            res.status(500).send({
                                                                statusMessage:
                                                                    "Error while saving new thumbnail file : " + err.message,
                                                                statusCode: -999
                                                            });
                                                            console.log("Error while saving new thumbnail file : " + err);
                                                        } else {
                                                            Video.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                                                                .then(data => {
                                                                    if (!data) {
                                                                        res.status(404).send({
                                                                            statusMessage: `Cannot update Video with id=${id}. Maybe Video was not found!`,
                                                                            statusCode: -999
                                                                        });
                                                                    } else res.send({
                                                                        statusMessage: `Video with id=${id} was updated successfully`,
                                                                        statusCode: 0
                                                                    });
                                                                })
                                                                .catch(err => {
                                                                    res.status(500).send({
                                                                        statusMessage: "Error updating Video with id=" + id + ". Error : " + err.message,
                                                                        statusCode: -999
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
                                            statusMessage: "Error updating Video with id=" + id + ". Error : " + err.message,
                                            statusCode: -999
                                        });
                                    });
                            }
                        });

                    }
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: "Error updating Video. Error : " + err.message,
                statusCode: -999
            });
        });


};

// Delete a Video with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Video.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    statusMessage: `Cannot delete Video with id=${id}. Maybe Video was not found!`,
                    statusCode: -999
                });

            } else {
                fs.unlink(videosPathFolder + data.videoFileName, (err) => {
                    if (err) {
                        res.status(500).send({
                            statusMessage: "Cannot Delete video with id=" + id,
                            statusCode: -999
                        });
                        console.log(err);
                    } else {
                        // kalo sukses
                        fs.unlink(thumbnailsPathFolder + data.videoThumbnailName, (err) => {
                            if (err) {
                                res.status(500).send({
                                    statusMessage: "Cannot Delete thumbnail video with id=" + id,
                                    statusCode: -999
                                });
                                console.log(err);
                            } else {
                                // kalo sukses
                                res.send({
                                    statusMessage: "Video with id=" + id + ",was deleted successfully!",
                                    statusCode: 0
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
                statusMessage: "Could not delete Video with id=" + id,
                statusCode: -999
            });
        });
};

// Delete all Video from the database.
exports.deleteAll = (req, res) => {


    fs.readdir(videosPathFolder, (err, files) => {
        // if (err) throw err;
        if (err) {
            res.status(500).send({
                statusMessage: "Could not read Videos folder",
                statusCode: -999
            });
        } else {
            for (const file of files) {
                fs.unlink(path.join(videosPathFolder, file), err => {
                    if (err) {
                        res.status(500).send({
                            statusMessage: "Could not delete Videos file",
                            statusCode: -999
                        });
                    } else {
                        fs.readdir(thumbnailsPathFolder, (err, files) => {
                            // if (err) throw err;
                            if (err) {
                                res.status(500).send({
                                    statusMessage: "Could not read Thumbnails folder",
                                    statusCode: -999
                                });
                            } else {
                                for (const file of files) {
                                    fs.unlink(path.join(thumbnailsPathFolder, file), err => {
                                        if (err) {
                                            res.status(500).send({
                                                statusMessage: "Could not delete Thumbnails file",
                                                statusCode: -999
                                            });
                                        } else {
                                            Video.deleteMany({})
                                                .then(data => {
                                                    res.send({
                                                        statusMessage: `${data.deletedCount} Videos were deleted successfully!`,
                                                        statusCode: 0
                                                    });
                                                })
                                                .catch(err => {
                                                    res.status(500).send({
                                                        statusMessage:
                                                            err.message || "Some error occurred while removing all Videos.",
                                                        statusCode: -999
                                                    });
                                                });
                                        }
                                    });
                                }
                            }


                        });
                    }
                });
            }
        }


    });




};

// Find all membership Video
exports.findAllMembership = (req, res) => {
    Video.find({ membership: true })
        .then(data => {
            res.send({
                statusMessage: "Berhasil GET all membership Videos",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage:
                    err.message || "Some error occurred while retrieving Videos.",
                statusCode: 0,
            });
        });
};

// Find all Categoried Video
exports.findAllCategoried = (req, res) => {
    Video.find({ category: req.query.category })
        .then(data => {
            res.send({
                statusMessage: "Berhasil GET all categorized Videos",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage:
                    err.message || "Some error occurred while retrieving Videos.",
                statusCode: 0,
            });
        });
};