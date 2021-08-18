
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            teacherUsername: String,
            teacherPassword : String,
            teacherName: String,
            teacherEmail : String,
            teacherPhone : String,
            teacherBirthday : String,
            teacherStatus : Number, //1 active, 0 notactive(resign or something)
            teacherUsertype : Number, //1 su // 2 normal

        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Teacher = mongoose.model("teacher", schema);
    return Teacher;
};