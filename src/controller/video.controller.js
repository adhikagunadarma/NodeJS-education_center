const db = require("../model");
const pathFolder = '.../assets/';
const fs = require('fs');
const path = require('path');

const Tutorial = db.tutorials;

// Create and Save a new Video
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Tutorial
    const video = new Video({
        title: req.body.title,
        description: req.body.desc,
        videoFile: req.body.videoFile,
        videoThumbnail: req.body.videoThumbnail,
        category: req.body.category,
        published: false,
        membership: req.body.member,
        totalViews: 0
    });

    const base64data = req.body.videoFile.replace(/^data:.*,/, '');
    fs.writeFile(pathFolder + req.body.title, base64data, 'base64', (err) => {
        if (err) {
            console.log(err);
        } else {
            // res.set('Location', userFiles + file.name);

            // Save Tutorial in the database
            video
                .save(video)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Video."
                    });
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
            console.log(data)
            if (!data)
                res.status(404).send({ message: "Not found Video with id " + id });
            else {
                fs.unlink(pathFolder + data.title, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // kalo sukses
                        // res.send(data);
                        Video.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                            .then(data => {
                                if (!data) {
                                    res.status(404).send({
                                        message: `Cannot update Video with id=${id}. Maybe Video was not found!`
                                    });
                                } else {
                                    fs.writeFile(pathFolder + req.body.title, base64data, 'base64', (err) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            // res.set('Location', userFiles + file.name);

                                            // Save Tutorial in the database
                                            video
                                                .save(video)
                                                .then(data => {
                                                    // res.send(data);

                                                    res.send({ message: "Video was updated successfully." });
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
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message: "Error updating Video with id=" + id
                                });
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
                fs.unlink(pathFolder + data.title, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // kalo sukses
                        res.send({
                            message: "Video was deleted successfully!"
                        });
                    }
                });


            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Video from the database.
exports.deleteAll = (req, res) => {


    fs.readdir(pathFolder, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
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