import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required!"],
      trim: true
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Message", messageSchema);
