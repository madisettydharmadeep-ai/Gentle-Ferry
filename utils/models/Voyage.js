import mongoose from 'mongoose';

const VoyageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  id: { // Keeping the timestamp ID for compatibility
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  journal: {
    type: String,
    default: '',
  },
  mood: {
    type: Number,
    default: 0,
  },
  photo: {
    type: String, // Base64 or URL
    default: null,
  },
  audio: {
    type: String, // Base64 or URL for voice notes
    default: null,
  },
  journalType: {
    type: String,
    enum: ['text', 'voice'],
    default: 'text',
  },
  tasks: [{
    id: String,
    text: String,
    checked: Boolean,
    isHabit: Boolean,
    habitSchedule: mongoose.Schema.Types.Mixed,
    iconName: String,
    updatedAt: Date
  }]
}, { 
  timestamps: true, // Automatically handles createdAt and updatedAt
  strict: false
});

export default mongoose.models.Voyage || mongoose.model('Voyage', VoyageSchema);
