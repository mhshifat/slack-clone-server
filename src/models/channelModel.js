import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Channel name is required!"],
      trim: true,
      lowercase: true,
      minlength: [2, "Channel name must be 5 characters length!"],
      maxlength: [12, "Channel name must not exceed 12 characters!"]
    },
    public: {
      type: Boolean,
      default: true
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  },
  {
    timestamps: true
  }
);

channelSchema.path("name").validate(async function(name) {
  const channel = this;
  return !(await mongoose.models.Channel.findOne({ name, team: channel.team }));
}, "Channel name has taken!");

export default mongoose.model("Channel", channelSchema);
