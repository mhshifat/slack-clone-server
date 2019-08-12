import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import { generateRefreshToken, generateToken } from "../helpers/userHelpers";

export const filterHeaders = async (resolver, parent, args, ctx, info) => {
  let resolverResult = await resolver(parent, args, ctx, info);
  const {
    req,
    res,
    models: { User }
  } = ctx;
  try {
    const getTokenFromHeaders = req.get("x-token");
    if (!getTokenFromHeaders)
      resolverResult = await resolver(parent, args, ctx, info);
    const decodedToken = jwt.verify(getTokenFromHeaders, jwtSecret);
    const userInfo = await User.findById(decodedToken.id);
    if (!userInfo) resolverResult = await resolver(parent, args, ctx, info);
    resolverResult = await resolver(
      parent,
      args,
      { ...ctx, authenticatedUser: userInfo },
      info
    );
  } catch (err) {
    const getRefTokenFromHeaders = req.get("x-refresh-token");
    if (!getRefTokenFromHeaders)
      resolverResult = await resolver(parent, args, ctx, info);
    const decodedRefToken = jwt.decode(getRefTokenFromHeaders);
    if (!decodedRefToken)
      resolverResult = await resolver(parent, args, ctx, info);
    const getUserInfo = await User.findById(decodedRefToken.id);
    if (!getUserInfo) resolverResult = await resolver(parent, args, ctx, info);
    const isValidRefToken = jwt.verify(
      getRefTokenFromHeaders,
      jwtSecret + getUserInfo.password
    );
    if (!isValidRefToken)
      resolverResult = await resolver(parent, args, ctx, info);
    if (isValidRefToken.rtc !== getUserInfo.rtc)
      resolverResult = await resolver(parent, args, ctx, info);
    const newToken = generateToken(getUserInfo);
    const newRefToken = generateRefreshToken(getUserInfo);
    if (newToken && newRefToken) {
      res.set("Access-Control-Expose-Headers, x-token, x-refresh-token");
      res.set("x-token", newToken);
      res.set("x-refresh-token", newRefToken);
      resolverResult = await resolver(
        parent,
        args,
        { ...ctx, authenticatedUser: getUserInfo },
        info
      );
    }
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return resolverResult;
  }
};
