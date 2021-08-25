module.exports = app => {
    const courses = require("../controller/course.controller.js");

    var router = require("express").Router();

    // Create a new course
    router.post("/course", courses.create);

    // Retrieve all courses
    router.get("/courses", courses.findAll);

    // Retrieve all courses by course
    router.get("/courses/teacher/:id", courses.findAllByTeacher);

    // Retrieve a single course with id
    router.get("/course/:id", courses.findOne);

    //     // Stream Single course
    // router.get("/course/stream/:id", courses.streamCourseTrailer);

    // Update a course with id
    router.put("/course/:id", courses.update);

    // Delete a course with id
    router.delete("/course/:id", courses.delete);

    // Delete all courses
    router.delete("/course", courses.deleteAll);

    // // Delete all courses by teacher Id
    // router.delete("/course/teacher/:id", courses.deleteAllByTeacher);

    app.use('/api/educen', router);
};