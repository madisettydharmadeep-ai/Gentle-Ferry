import mongoose from 'mongoose';

const BroadcastSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD format for easy matching
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'okaaa.jpg',
  },
  createdBy: {
    type: String,
    default: 'Admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Broadcast || mongoose.model('Broadcast', BroadcastSchema);
