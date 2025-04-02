import mongoose, {Schema} from "mongoose";
import {IMessage, IMessageType} from "../types/message.types.js";


const MessageSchema = new Schema<IMessage>(
    {
      conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },
      type: {
        type: String,
        enum: Object.values(IMessageType),
        default: IMessageType.TEXT
      },
      content: {
        type: String,
        required: function (this: IMessage) {
          return this.type === IMessageType.TEXT;
        },
        trim: true
      },
      resources: [{
        type: Schema.Types.ObjectId,
        ref: "Resource"
      }],
      replyTo: {
        type: Schema.Types.ObjectId,
        ref: "Message"
      },
      deletedFor: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      isDeleted: {
        type: Boolean,
        default: false
      },
      isEdited: {
        type: Boolean,
        default: false
      },
    },
    {
      timestamps: true,
      toJSON: {virtuals: true},
      toObject: {virtuals: true}
    }
);

MessageSchema.index({conversation: 1, createdAt: -1});

MessageSchema.index({sender: 1, createdAt: -1});
MessageSchema.index({isDeleted: 1, conversation: 1});
MessageSchema.index({resources: 1}, {sparse: true}); //for Resources tab

MessageSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

// Add method to edit a message and track history
MessageSchema.methods.editMessage = function (newContent: string) {
  this.content = newContent;
  this.isEdited = true;
  return this.save();
};


const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
