import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    default: 'Sparkles',
  },
  habitSchedule: {
    type: mongoose.Schema.Types.Mixed, // { type: 'daily' | 'weekdays' | 'weekends' | 'custom', days: [0-6] }
    required: true,
  },
  color: {
    bg: String,
    accent: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { 
  timestamps: true,
  strict: false
});

// Ensure a user doesn't have duplicate habits by text
HabitSchema.index({ userId: 1, text: 1 }, { unique: true });

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema);
