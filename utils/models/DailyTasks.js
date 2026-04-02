import mongoose from 'mongoose';

const DailyTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tasks: [{
    id: String,
    text: String,
    checked: Boolean,
    isHabit: Boolean,
    habitSchedule: mongoose.Schema.Types.Mixed,
    iconName: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  }
}, { 
  timestamps: true,
  strict: false
});

DailyTaskSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.DailyTasks || mongoose.model('DailyTasks', DailyTaskSchema);
