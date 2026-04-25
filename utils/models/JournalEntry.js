import mongoose from 'mongoose';

const JournalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  text: {
    type: String,
    default: '',
  },
  driveImageUrl: {
    type: String,
    default: null,
  },
  driveFileId: {
    type: String,
    default: null,
  },
  mood: {
    type: String,
    default: null,
  },
  entryDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  highlights: [{
    start: Number,
    end: Number,
    bg: String,
    color: String
  }],
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null,
    index: true,
  },
}, {
  timestamps: true,
});

// Index for calendar queries
JournalEntrySchema.index({ userId: 1, entryDate: -1 });

export default mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema);
