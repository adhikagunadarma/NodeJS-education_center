module.exports = app => {
    const categories = require("../controller/category.controller.js");

    var router = require("express").Router();

    // Create a new category
    router.post("/category", categories.create);

    // Retrieve all categories
    router.get("/categories", categories.findAll);


    // Retrieve a single category with id
    router.get("/category/:id", categories.findOne);

    // Update a category with id
    router.put("/category/:id", categories.update);

    // Delete a category with id
    router.delete("/category/:id", categories.delete);

    // Create a new category
    router.delete("/category", categories.deleteAll);

    app.use('/api/educen', router);
};