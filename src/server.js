import { GraphQLServer, PubSub } from "graphql-yoga";
import jwt from "jsonwebtoken";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import { baseUrl, port } from "./config/config";
import DbConnection from "./database/conn";
import { filterHeaders } from "./middlewares/appMiddlewares";
import Channel from "./models/channelModel";
import DirectMessage from "./models/directMessageModel";
import Member from "./models/memberModel";
import Message from "./models/messageModel";
import Team from "./models/teamModel";
import User from "./models/userModel";

const pubsub = new PubSub();
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "types")));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, "resolvers")));
const models = { User, Team, Channel, Member, Message, DirectMessage };

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request: req, response: res, connection }) => ({
    req,
    res,
    models,
    authenticatedUser: null,
    pubsub,
    subCtx: connection && connection.context
  }),
  middlewares: [filterHeaders]
});

DbConnection().then(() => {
  server.start(
    {
      port,
      endpoint: "/api",
      subscriptions: {
        path: "/subscription",
        onConnect: ({ token, refreshToken }) => {
          if (!token || !refreshToken) throw new Error("Unauthenticated user!");
          try {
            jwt.decode(refreshToken);
            const decodedToken = jwt.decode(token);
            return { currentUser: decodedToken };
          } catch (err) {
            throw new Error("Unauthenticated user!");
          }
        }
      }
    },
    () => {
      // eslint-disable-next-line no-console
      console.log(`[ SLACK-CLONE ] >>>>> The server is running on ${baseUrl}!`);
    }
  );
});
