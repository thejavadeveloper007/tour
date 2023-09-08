const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    blogContent: {
        type: String,
        required: true
    }
});

const Blog = mongoose.model('blog', BlogSchema);

module.exports = Blog;