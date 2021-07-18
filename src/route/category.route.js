module.exports = app => {
    const categories = require("../controller/category.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/category", categories.create);

    // Retrieve all videos
    router.get("/categories", categories.findAll);


    // Retrieve a single Tutorial with id
    router.get("/category/:id", categories.findOne);

    // Update a Tutorial with id
    router.put("/category/:id", categories.update);

    // Delete a Tutorial with id
    router.delete("/category/:id", categories.delete);

    // Create a new Tutorial
    router.delete("/category", categories.deleteAll);

    app.use('/api/educen', router);
};