const db = require("../model");
const videosPathFolder = './assets/video/videos/';
const thumbnailsPathFolder = './assets/video/thumbnails/';

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
                "Content Cannot be empty",
            statusCode: -999
        });
        return;
    }

    // Create a Video
    const video = new Video({
        videoTitle: req.body.videoTitle,
        videoDescription: req.body.videoDescription,
        videoFile: req.body.videoFile, // teralu gede untuk disimpen di db
        videoThumbnail: req.body.videoThumbnail,
        videoFileName: req.body.videoFileName,
        videoThumbnailName: req.body.videoThumbnailName,
        videoCourse: req.body.videoCourse,
        videoTotalViews: 0
    });


    // thumbnail and video are required so, no if
    const videoBase64data = req.body.videoFile.replace(/^data:.*,/, '');
    fs.writeFile(videosPathFolder + req.body.videoFileName, videoBase64data, 'base64', (err) => {

        if (err) {
            res.status(500).send({
                statusMessage:
                    "Error while saving video file : " + err.message,

                statusCode: -999
            });
            console.log(err);
        }
    });


    // thumbnail and video are required so, no if
    const thumbnailBase64data = req.body.videoThumbnail.replace(/^data:.*,/, '');
    fs.writeFile(thumbnailsPathFolder + req.body.videoThumbnailName, thumbnailBase64data, 'base64', (err) => {
        if (err) {
            res.status(500).send({
                statusMessage:
                    "Error while saving thumbnail file : " + err.message,
                statusCode: -999
            });
            console.log(err);
        } else {


        }
    });


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

};

findCourseName = (id) => {
    return new Promise((resolve, reject) => {
        Course.findById(id)
            .then(dataCourse => {
                if (!dataCourse)
                    reject(-999)
                else {
                    resolve(dataCourse.courseName)
                }
            })
            .catch(err => {
                reject(-999)
            });
    })
}

// Retrieve all Video from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Video.find(condition)
        .then(async (data) => {
            let updatedList = []
            for (const element of data) {
                const newData = element
                newData.videoCourse = await findCourseName(element.videoCourse)
                updatedList.push(newData)
            }
            res.send({
                statusMessage: "Berhasil GET all videos",
                statusCode: 0,
                data: updatedList
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the Video.",
                statusCode: -999,
            });
        });
};

// Find a all Video by course id
exports.findAllByCourse = (req, res) => {
    const id = req.params.id;
    var condition = id ? { videoCourse: id } : {};
    Video.find(condition)
        .then(async (data) => {
            let updatedList = []

            for (const element of data) {

                const newData = element
                newData.videoCourse = await findCourseName(element.videoCourse)

                updatedList.push(newData)
            }
            res.send({
                statusMessage: "Berhasil GET all videos by course name " + updatedList[0].videoCourse, // karena semua video berasal dr course yg sama
                statusCode: 0,
                data: updatedList
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
        .then(async (data) => {
            if (!data)
                res.status(404).send({
                    statusMessage: "Not found Video with id " + id,
                    statusCode: -999,
                });
            else {
                data.videoCourse = await findCourseName(data.videoCourse)
                res.send({
                    statusMessage: "Berhasil GET course with id " + id,
                    statusCode: 0,
                    data: data
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    statusMessage: "Error retrieving Video with id=" + id,
                    statusCode: -999,
                });
        });
};

// Stream a single Video with an id
exports.streamVideo = (req, res) => {
    const id = req.params.id;

    Video.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    statusMessage: "Cannot Stream video with id " + id,
                    statusCode: -999,
                });
            else {
                const videoPath = videosPathFolder + data.videoFileName;
                const videoStat = fs.statSync(videoPath);
                const fileSize = videoStat.size;
                const videoRange = req.headers.range;
                if (videoRange) {
                    const parts = videoRange.replace(/bytes=/, "").split("-");
                    const start = parseInt(parts[0], 10);
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize - 1;
                    const chunksize = (end - start) + 1;
                    const file = fs.createReadStream(videoPath, { start, end });
                    const head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4',
                    };
                    res.writeHead(206, head);
                    file.pipe(res);
                } else {
                    const head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    };
                    res.writeHead(200, head);
                    fs.createReadStream(videoPath).pipe(res);
                }
                // res.send({
                //     statusMessage: "Berhasil get Video with id " + id,
                //     statusCode: 0,
                //     data: data
                // });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    statusMessage: "Cannot Stream video with id " + id,
                    statusCode: -999,
                });
        });
};

// Update a Video by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
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

                //if there are new thumbnail or video along the new params, then need to delete the old one, otherwise dont bother
                if (req.body.videoFile && req.body.videoFileName) {
                    fs.unlink(videosPathFolder + data.videoFileName, (err) => {
                        if (err) {
                            res.status(500).send({
                                statusMessage:
                                    "Error while deleting video file : " + err.message,
                                statusCode: -999
                            });
                            console.log("Error while deleting video file : " + err);
                            return
                        } else {
                            const videoBase64data = req.body.videoFile.replace(/^data:.*,/, '');
                            fs.writeFile(videosPathFolder + req.body.videoFileName, videoBase64data, 'base64', (err) => {
                                if (err) {
                                    res.status(500).send({
                                        statusMessage:
                                            "Error while saving new video file : " + err.message,
                                        statusCode: -999
                                    });
                                    console.log("Error while saving new video file : " + err);
                                    return
                                }
                            });
                        }
                    });

                }
                if (req.body.videoThumbnail && req.body.videoThumbnailName) {
                    fs.unlink(thumbnailsPathFolder + data.videoThumbnailName, (err) => {
                        if (err) {
                            res.status(500).send({
                                statusMessage:
                                    "Error while deleting video thumbnail file : " + err.message,
                                statusCode: -999
                            });
                            console.log("Error while deleting video thumbnail file : " + err);
                            return
                        } else {

                            const thumbnailBase64data = req.body.videoThumbnail.replace(/^data:.*,/, '');

                            fs.writeFile(thumbnailsPathFolder + req.body.videoThumbnailName, thumbnailBase64data, 'base64', (err) => {
                                if (err) {
                                    res.status(500).send({
                                        statusMessage:
                                            "Error while saving new thumbnail file : " + err.message,
                                        statusCode: -999
                                    });
                                    console.log("Error while saving new thumbnail file : " + err);
                                    return
                                }
                            });
                        }
                    });
                }


                Video.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
                    .then(data => {
                        if (!data) {
                            res.status(404).send({
                                statusMessage: `Cannot update Video with id=${id}. Maybe Video was not found!`,
                                statusCode: -999
                            });
                        } else {
                            res.send({
                                statusMessage: `video with id=${id} was updated successfully`,
                                statusCode: 0
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
                        return
                    }
                });

                // kalo sukses
                fs.unlink(thumbnailsPathFolder + data.videoThumbnailName, (err) => {
                    if (err) {
                        res.status(500).send({
                            statusMessage: "Cannot Delete thumbnail video with id=" + id,
                            statusCode: -999
                        });
                        console.log(err);
                        return
                    }
                });

                res.send({
                    statusMessage: "Video with id=" + id + ",was deleted successfully!",
                    statusCode: 0
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
            return
        } else {
            for (const file of files) {
                fs.unlink(path.join(videosPathFolder, file), err => {
                    if (err) {
                        res.status(500).send({
                            statusMessage: "Could not delete Videos file",
                            statusCode: -999
                        });
                        return
                    }
                });
            }
        }


    });

    fs.readdir(thumbnailsPathFolder, (err, files) => {
        // if (err) throw err;
        if (err) {
            res.status(500).send({
                statusMessage: "Could not read Thumbnails folder",
                statusCode: -999
            });
            return
        } else {
            for (const file of files) {
                fs.unlink(path.join(thumbnailsPathFolder, file), err => {
                    if (err) {
                        res.status(500).send({
                            statusMessage: "Could not delete Thumbnails file",
                            statusCode: -999
                        });
                        return
                    }
                });
            }
        }


    });

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




};

// Delete all Video by course id
exports.deleteAllByCourse = async (req, res) => {
    const id = req.params.id;
    const courseName = await findCourseName(id)

    var condition = { videoCourse: id };

    Video.find(condition)
        .then(async (data) => {
            for (const element of data) {
                Video.findByIdAndRemove(element.id)
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
                                    return
                                }
                            });

                            // kalo sukses
                            fs.unlink(thumbnailsPathFolder + data.videoThumbnailName, (err) => {
                                if (err) {
                                    res.status(500).send({
                                        statusMessage: "Cannot Delete thumbnail video with id=" + id,
                                        statusCode: -999
                                    });
                                    console.log(err);
                                    return
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
            }
            res.send({
                statusMessage: "Berhasil delete all videos with course name " + courseName,
                statusCode: 0
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the Video.",
                statusCode: -999,
            });
        });



};

// // Find all membership Video
// exports.findAllMembership = (req, res) => {
//     Video.find({ membership: true })
//         .then(data => {
//             res.send({
//                 statusMessage: "Berhasil GET all membership Videos",
//                 statusCode: 0,
//                 data: data
//             });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 statusMessage:
//                     err.message || "Some error occurred while retrieving Videos.",
//                 statusCode: 0,
//             });
//         });
// };

// // Find all Categoried Video
// exports.findAllCategoried = (req, res) => {
//     Video.find({ category: req.query.category })
//         .then(data => {
//             res.send({
//                 statusMessage: "Berhasil GET all categorized Videos",
//                 statusCode: 0,
//                 data: data
//             });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 statusMessage:
//                     err.message || "Some error occurred while retrieving Videos.",
//                 statusCode: 0,
//             });
//         });
// };