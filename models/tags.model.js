import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = Schema;

const tagSchema = new Schema({
  tag_name: {type: String, required: true},
  room_id: {type: [ObjectId] }
}, {
  timestamps: true,
  collection: 'tags'
});

export default mongoose.model('tags', tagSchema);
