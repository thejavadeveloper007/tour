const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    blogContent: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
});

const Blog = mongoose.model('blog', BlogSchema);

module.exports = Blog;