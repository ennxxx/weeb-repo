import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    author: { type: Number, ref: 'User', autopopulate: true }, 
    profpic: { type: String },
    comID: { type: Number },
    reply: [], 
});

const Comment = mongoose.model('Comment', commentSchema);

export { Comment, commentSchema };
