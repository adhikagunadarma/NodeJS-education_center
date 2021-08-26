
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            videoTitle: String,
            videoDescription: String,
            videoFile: String,
            videoFileName: String,
            videoThumbnail: String,
            videoThumbnailName: String,
            videoCourse: String,
            videoTotalViews: Number
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;

        delete object.videoFile
        return object;
    });

    const Video = mongoose.model("video", schema);
    return Video;
};