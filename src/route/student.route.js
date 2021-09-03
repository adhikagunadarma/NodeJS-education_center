module.exports = app => {
    const students = require("../controller/student.controller.js");

    var router = require("express").Router();

    // Create a new student
    router.post("/student", students.create);

    // Retrieve all students
    router.get("/students", students.findAll);


    // Retrieve a single student with id
    router.get("/student/:id", students.findOne);

    // Update a student with id
    router.put("/student/:id", students.update);

    // Delete a student with id
    router.delete("/student/:id", students.delete);

    // Create a new student
    router.delete("/student", students.deleteAll);


    // student login
    router.post("/student/login", students.login);


    // student change pass
    router.post("/student/changePassword", students.changePass);


    // student buy course 
    router.post("/student/buyCourse", students.buyCourse);

    app.use('/api/educen', router);
};