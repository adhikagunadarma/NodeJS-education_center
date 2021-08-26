module.exports = app => {
    const videos = require("../controller/video.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/video", videos.create);

    // Retrieve all videos
    router.get("/videos", videos.findAll);

    // Retrieve all videos by course
    router.get("/videos/course/:id", videos.findAllByCourse);


    // // Retrieve all membership videos
    // router.get("/videos/membership/", videos.findAllMembership);


    // // Retrieve all categoried videos
    // router.get("/videos/category/", videos.findAllCategoried);

    // Retrieve a single Tutorial with id
    router.get("/video/:id", videos.findOne);

    // Stream Single Video
    router.get("/video/stream/:id", videos.streamVideo);

    // Update a Tutorial with id
    router.put("/video/:id", videos.update);

    // Delete a Tutorial with id
    router.delete("/video/:id", videos.delete);

    // Delete all videos
    router.delete("/video", videos.deleteAll);

    // Delete all videos by course Id
    router.delete("/videos/course/:id", videos.deleteAllByCourse);

    app.use('/api/educen', router);
};