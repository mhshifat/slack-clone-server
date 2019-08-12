import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";

export const hashUserPassword = async password =>
  await bcrypt.hash(password, 12);

export const validateLoginDataFields = data => {
  const errors = [];

  if (!data.email)
    errors.push({ path: "email", message: "Email is required!" });
  if (!data.password)
    errors.push({ path: "password", message: "Password is required!" });

  return { isValid: !errors.length > 0, errors };
};

export const findExistingUser = async (queryObj, User) =>
  await User.findOne(queryObj);

export const validateUserPassword = async (password, hashedPwd) =>
  await bcrypt.compare(password, hashedPwd);

export const validateLoginDataWithDb = async ({ email, password }, User) => {
  const errors = [];

  const userInfo = await findExistingUser({ email }, User);
  if (!userInfo)
    errors.push({
      path: "email",
      message: "A user of this email doesn't exist!"
    });

  const isPwdValid = await validateUserPassword(
    password,
    userInfo.password || ""
  );
  if (!isPwdValid)
    errors.push({
      path: "password",
      message: "Provided password is wrong!"
    });

  return { isValid: !errors.length > 0, errors };
};

export const generateToken = userInfo => {
  const userData = { ...userInfo._doc };
  delete userData._id;
  delete userData.rtc;
  delete userData.password;
  delete userData.__v;
  userData.id = userInfo.id;
  return jwt.sign(userData, jwtSecret, { expiresIn: "1s" });
};

export const generateRefreshToken = userInfo => {
  const userData = { ...userInfo._doc };
  delete userData._id;
  delete userData.password;
  delete userData.__v;
  userData.id = userInfo.id;
  return jwt.sign(userData, jwtSecret + userInfo.password, { expiresIn: "1d" });
};

export const generateTokensForLogin = async (data, User) => {
  const userInfo = await findExistingUser({ email: data.email }, User);
  const newToken = generateToken(userInfo);
  const updatedUser = await User.findByIdAndUpdate(
    userInfo.id,
    {
      rtc: userInfo.rtc + 1
    },
    { new: true }
  );
  const newRefToken = generateRefreshToken(updatedUser);
  return { token: newToken, refreshToken: newRefToken };
};
