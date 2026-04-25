import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  color: {
    type: String,
    default: '#E8B4B8', // soft blush default
  },
  entryCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique collection names per user
CollectionSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
