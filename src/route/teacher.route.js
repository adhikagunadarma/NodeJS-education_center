module.exports = app => {
    const teachers = require("../controller/teacher.controller.js");

    var router = require("express").Router();

    // Create a new teacher
    router.post("/teacher", teachers.create);

    // Retrieve all teachers
    router.get("/teachers", teachers.findAll);


    // Retrieve a single teacher with id
    router.get("/teacher/:id", teachers.findOne);

    // Update a teacher with id
    router.put("/teacher/:id", teachers.update);

    // Delete a teacher with id
    router.delete("/teacher/:id", teachers.delete);

    // Create a new teacher
    router.delete("/teacher", teachers.deleteAll);

    
    // Teacher login
    router.post("/teacher/login", teachers.login);

    
    // Teacher change pass
    router.post("/teacher/changePassword", teachers.changePass);

    app.use('/api/educen', router);
};