/* eslint-disable no-console */
import mongoose from "mongoose";
import { db } from "../config/config";

export default () =>
  mongoose.connect(
    db,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    },
    err => {
      if (err) {
        console.error(err);
        console.error("[ SLACK-CLONE ] >>>>> Database connection failed!");
        process.exit(1);
      }
      console.log(
        "[ SLACK-CLONE ] >>>>> A database connection has been established!"
      );
    }
  );
