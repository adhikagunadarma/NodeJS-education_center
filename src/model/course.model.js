
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            courseName: String,
            courseDescription: String,
            courseThumbnail: String,
            courseThumbnailName: String,
            courseTrailerVideoFile: String,
            courseTrailerVideoName: String,
            courseTotalBought: Number,
            courseMembership: Boolean,
            coursePublished: Boolean,
            courseTeacher: String,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;

        delete object.courseTrailerVideoFile
        return object;
    });

    const Course = mongoose.model("course", schema);
    return Course;
};