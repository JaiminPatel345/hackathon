import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BuddyRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['buddy', 'follower'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

BuddyRequestSchema.index({ sender: 1, receiver: 1, type: 1 }, { unique: true });

const BuddyRequest = mongoose.model('BuddyRequest', BuddyRequestSchema);
export default BuddyRequest;