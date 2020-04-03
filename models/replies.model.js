import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = Schema;

const replySchema = new Schema({
  owner_id: { type: ObjectId, ref: 'users', required: true},
  comment_id: { type: ObjectId, ref: 'comments', required: true},
  reply_describe: { type: String, requires: true },
  like: { type: Number, default: 0 },
  dislike: {type: Number, default: 0},
  created_at: Date,
  updated_at: Date
}, {
  timestamps: true,
  collection: 'replies'
});

export default mongoose.model('replies', replySchema);
