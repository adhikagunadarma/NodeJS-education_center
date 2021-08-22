
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            studentUsername: { type : String , unique : true, required : true},
            studentPassword : String,
            studentName: String,
            studentEmail : String,
            studentPhone : String,
            studentBirthday : String,
            studentMembership : Boolean, //for accessing course if only payment system is subscription
            studentStatus : Number, //1 active, 0 notactive(dead or something) test something againig
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Student = mongoose.model("student", schema);
    return Student;
};