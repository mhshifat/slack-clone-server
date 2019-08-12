import mongoose from "mongoose";
import * as userHelpers from "../helpers/userHelpers";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      trim: true,
      lowercase: true,
      minlength: [5, "Username must be 5 characters length!"],
      maxlength: [12, "Username must not exceed 12 characters!"],
      unique: true
    },
    email: {
      type: String,
      required: [true, "Email address is required!"],
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      trim: true
    },
    rtc: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified()) return next();
  this.password = await userHelpers.hashUserPassword(this.password);
  next();
});

userSchema
  .path("username")
  .validate(
    async username => !(await mongoose.models.User.findOne({ username })),
    "Username has taken!"
  );

userSchema
  .path("email")
  .validate(
    async email => !(await mongoose.models.User.findOne({ email })),
    "A user of this email already exist!"
  );

userSchema
  .path("password")
  .validate(
    async password => password.length >= 10,
    "Password must be 12 characters long!"
  );

export default mongoose.model("User", userSchema);
