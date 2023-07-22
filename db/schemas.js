import mongoose from 'mongoose';

// Define the user schema.
const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    profile_pic: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true },
    bio: { type: String },
    followers_info: { type: String },
});

const User = mongoose.model('User', userSchema);

export { User };

// Define the comment schema
const commentSchema = new mongoose.Schema({
    author: { type: String },
    content: { type: String },
    profpic: { type: String },
    comID: { type: Number },
    reply: [{
        author: { type: String },
        content: { type: String },
        profpic: { type: String }
    }]
});

// Define the post schema
const postSchema = new mongoose.Schema({
    post_id: { type: Number, unique: true },
    title: { type: String },
    author: { type: String },
    content: { type: String },
    image: { type: String },
    comments: [commentSchema]
});

const Post = mongoose.model('Post', postSchema);

export { Post };