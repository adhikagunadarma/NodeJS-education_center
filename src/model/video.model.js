
module.exports = mongoose => {
    var schema = mongoose.Schema(
        mongoose.Schema(
            {
                title: String,
                description: String,
                videoFile: String,
                videoThumbnail: String,
                category: Number,
                published: Boolean,
                membership: Boolean
            },
            { timestamps: true }
        )
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Video = mongoose.model("video", schema);
    return Video;
};