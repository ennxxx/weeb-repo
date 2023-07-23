import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    profile_pic: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true },
    bio: { type: String },
    followers_info: { type: String },
    postsMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }], 
});

const User = mongoose.model('User', userSchema);

export { User };

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    content: { type: String }, 
    profpic: { type: String },
    comID: { type: Number },
    reply: [], 
});

// Define the post schema
const postSchema = new mongoose.Schema({
    post_id: { type: Number, unique: true },
    title: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    content: { type: String },
    image: { type: String },
    comments: [commentSchema],
    voteCtr: { type: Number },
    comCtr: { type: Number }
});

const Post = mongoose.model('Post', postSchema);

export { Post };