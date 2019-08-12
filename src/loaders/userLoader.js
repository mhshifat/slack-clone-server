import DataLoader from "dataloader";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";

export default new DataLoader(
  catchAsync(async keys => await User.find({ _id: { $in: keys } }))
);
