import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = Schema;

const commentSchema = new Schema({
  owner_id: { type: ObjectId, ref: 'users', required: true},
  room_id: { type: ObjectId, ref: 'rooms', required: true},
  comment_describe: { type: String, requires: true },
  comment_replies: { type: [ObjectId], ref: 'comments' },
  like: { type: Number, default: 0 },
  dislike: {type: Number, default: 0},
  created_at: Date,
  updated_at: Date
}, {
  timestamps: true,
  collection: 'comments'
});

export default mongoose.model('comments', commentSchema);
