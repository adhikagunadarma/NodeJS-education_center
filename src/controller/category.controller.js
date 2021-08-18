const db = require("../model");
const Category = db.category;

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            statusMessage:
                "Content Cannot be empty",
            statusCode: -999
        });
    }

    // Create a Tutorial
    const category = new Category({
        categoryName: req.body.categoryName,
        categoryDescription: req.body.categoryDescription ?? null,
        categoryThumbnail: req.body.categoryThumbnail ?? null,

    });

    // Save Tutorial in the database
    category
        .save(category)
        .then(data => {
            res.status(200).send({
                statusMessage:
                    "Category " + req.body.name + " has been created",
                statusCode: 0
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while creating the Category.",
                statusCode: -999,
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const name = req.query.categoryName;
    var condition = name ? { categoryName: { $regex: new RegExp(title), $options: "i" } } : {};

    Category.find(condition)
        .then(data => {
            res.send({
                statusMessage: "Success at fetching all categories",
                statusCode: 0,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: err.message || "Some error occurred while retrieving the Categories.",
                statusCode: -999,
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Category.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    statusMessage: "Not found Category with id " + id,
                    statusCode: -999,
                });
            else {
                res.send({
                    statusMessage: "Success at fetching category with id " + id,
                    statusCode: 0,
                    data: data
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    statusMessage: "Error retrieving Category with id=" + id,
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

    Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    statusMessage: `Cannot update Category with id=${id}. Maybe Category was not found!`,
                    statusCode: -999
                });
            } else {
                res.send({
                    statusMessage: `Category with id=${id} was updated successfully`,
                    statusCode: 0
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: "Error updating Category with id=" + id + ". Error : " + err.message,
                statusCode: -999
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Category.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    statusMessage: `Cannot delete Category with id=${id}. Maybe Category was not found!`,
                    statusCode: -999
                });
            } else {
                res.send({
                    statusMessage: "Category " + data.categoryName + " was deleted successfully!",
                    statusCode: 0
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                statusMessage: "Could not delete Category with id=" + id,
                statusCode: -999
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Category.deleteMany({})
        .then(data => {
            res.send({
                statusMessage: `${data.deletedCount} Categories were successfully deleted!`,
                statusCode: 0
            });
        })
        .catch(err => {
            res.status(500).send({
                statusMessage:
                    err.message || "Some error occurred while removing all Categories.",
                statusCode: -999
            });
        });
};

