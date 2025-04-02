import mongoose, {Schema} from "mongoose";
import {IResource, IResourceType} from "../types/message.types.js";

const ResourceSchema = new Schema<IResource>({
  type: {
    type: String,
    enum: Object.values(IResourceType),
    required: true
  },
  filename: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
  },
  size: {
    type: Number,
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Use more efficient compound indexes
ResourceSchema.index({conversation: 1, type: 1}); // Find resources by type in a conversation
ResourceSchema.index({message: 1}, {unique: false}); // Find resources for a message
ResourceSchema.index({uploader: 1, createdAt: -1}); // Find resources uploaded by a user sorted by date
ResourceSchema.index({isDeleted: 1, conversation: 1}); // Find non-deleted resources in a conversation

// Virtual for file extension
ResourceSchema.virtual('fileExtension').get(function() {
  if (this.filename) {
    const parts = this.filename.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() : '';
  }
  return '';
});

// Virtual for determining if resource is an image
ResourceSchema.virtual('isImage').get(function() {
  return this.type === IResourceType.IMAGE;
});

const Resource = mongoose.model<IResource>("Resource", ResourceSchema);
export default Resource;