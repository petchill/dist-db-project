import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = Schema;

const roomSchema = new Schema({
  owner_id: { type: ObjectId, ref: 'users', required: true},
  room_head: { type: String, required: true },
  room_describe: { type: String, requires: true },
  room_comments: { type: [ObjectId], ref: 'comments' },
  room_tag_id: { type: [ObjectId], default: [] },
  like: { type: Number, default: 0 },
  dislike: {type: Number, default: 0},
  created_at: Date,
  updated_at: Date
}, {
  timestamps: true,
  collection: 'rooms'
});

export default mongoose.model('rooms', roomSchema);
