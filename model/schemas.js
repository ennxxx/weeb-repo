import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const userSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true },
    profile_pic: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    bio: { type: String },
    followers_info: { type: String },
    postsMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }],
    commentsMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', autopopulate: true }]
});

const User = mongoose.model('User', userSchema);

export { User };

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    content: { type: String },
    comment_id: { type: Number, required: true, unique: true },
    parentPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', autopopulate: true },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', autopopulate: true }],
    voteCtr: { type: Number }
});

const Comment = mongoose.model('Comment', commentSchema);

export { Comment };

// Define the post schema
const postSchema = new mongoose.Schema({
    post_id: { type: Number, unique: true },
    title: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    content: { type: String },
    image: { type: String },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', autopopulate: true }],
    voteCtr: { type: Number },
    comCtr: { type: Number },
    upvotedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }],
    downvotedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }],
    savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }],
});

const Post = mongoose.model('Post', postSchema);

export { Post };