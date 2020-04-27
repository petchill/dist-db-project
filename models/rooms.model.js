import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = Schema;

const roomSchema = new Schema({
  owner_id: { type: ObjectId, ref: 'users', required: true},
  owner_name: { type: String, required: true },
  room_topic: { type: String, required: true },
  room_describe: { type: String, requires: true },
  room_comments: { type: [ObjectId], ref: 'comments' },
  room_tags: { type: Array },
  like: { type: Number, default: 0 },
  dislike: {type: Number, default: 0},
  created_at: Date,
  updated_at: Date
}, {
  timestamps: true,
  collection: 'rooms'
});

export default mongoose.model('rooms', roomSchema);
