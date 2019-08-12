import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required!"],
      trim: true,
      lowercase: true,
      minlength: [2, "Team name must be 5 characters length!"],
      maxlength: [12, "Team name must not exceed 12 characters!"]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

teamSchema.path("name").validate(async function(name) {
  const team = this;
  return !(await mongoose.models.Team.findOne({ name, owner: team.owner }));
}, "Team name has taken!");

export default mongoose.model("Team", teamSchema);
