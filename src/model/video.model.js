
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            videoFile: String,
            videoFileName: String,
            videoThumbnail: String,
            videoThumbnailName: String,
            category: String,
            published: Boolean,
            membership: Boolean,
            totalViews: Number
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Video = mongoose.model("video", schema);
    return Video;
};