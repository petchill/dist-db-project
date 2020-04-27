import mongoose from 'mongoose'

const { Schema } = mongoose;
const { ObjectId } = Schema; 

const userSchema = new Schema({
  username: { type: String, require: true, unique: true},
  password: { type: String, require: true},
  room_id: { type: [ObjectId] },
  created_at: Date,
  updated_at: Date
}, {
  timestamps: true,
  collection: 'users'
});

export default mongoose.model('users', userSchema);
