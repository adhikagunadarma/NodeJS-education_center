
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            categoryName: String,
            categoryDescription: String ,
            categoryThumbnail : String ,
            categoryThumbnailName : String,

        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Category = mongoose.model("category", schema);
    return Category;
};