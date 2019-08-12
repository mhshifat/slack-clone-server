import { combineResolvers } from "graphql-resolvers";
import { withFilter } from "graphql-yoga";
import catchAsync from "../utils/catchAsync";
import isAuthenticated from "../utils/isAuthenticated";

export default {
  // Queries
  Query: {
    messages: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (_, { channelId }, { models: { Message } }) =>
          await Message.find({
            channel: channelId
          })
      )
    )
  },
  // Mutations
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (
          _,
          { data: { channelId, ...rest } },
          { models: { Message }, authenticatedUser, pubsub }
        ) => {
          const createdMessage = await Message.create({
            ...rest,
            channel: channelId,
            user: authenticatedUser.id
          });
          pubsub.publish("NEW_MESSAGE", {
            channelId,
            newMessage: createdMessage
          });
          return { success: true, message: createdMessage };
        }
      )
    )
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("NEW_MESSAGE"),
        (payload, args) => payload.channelId === args.channelId
      )
    }
  },
  // Message
  Message: {
    user: async ({ user }, _, { models: { User } }) =>
      await User.findById(user),
    channel: async ({ channel }, _, { models: { Channel } }) =>
      await Channel.findById(channel)
  }
};
