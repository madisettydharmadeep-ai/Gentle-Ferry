import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  settings: {
    isPremium: { type: Boolean, default: false },
    isDarkMode: { type: Boolean, default: false },
    isProductive: { type: Boolean, default: true },
  },
  ignoredHabits: {
    type: [String],
    default: [],
  },
  googleRefreshToken: {
    type: String,
  },
  googleDriveFolderId: {
    type: String,
  }
}, { 
  timestamps: true 
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
