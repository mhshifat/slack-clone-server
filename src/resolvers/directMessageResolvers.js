import { combineResolvers } from "graphql-resolvers";
import { withFilter } from "graphql-yoga";
import catchAsync from "../utils/catchAsync";
import isAuthenticated from "../utils/isAuthenticated";

export default {
  // Queries
  Query: {
    directMessages: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (
          _,
          { receiverId },
          { models: { DirectMessage }, authenticatedUser }
        ) =>
          await DirectMessage.find({
            $or: [
              { receiver: receiverId, sender: authenticatedUser.id },
              { receiver: authenticatedUser.id, sender: receiverId }
            ]
          })
      )
    )
  },
  // Mutations
  Mutation: {
    createDirectMessage: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (
          _,
          { data: { receiverId, ...rest } },
          { models: { DirectMessage }, authenticatedUser, pubsub }
        ) => {
          const createdDirectMessage = await DirectMessage.create({
            ...rest,
            receiver: receiverId,
            sender: authenticatedUser.id
          });
          pubsub.publish("NEW_DIRECT_MESSAGE", {
            receiverId,
            newDirectMessage: createdDirectMessage
          });
          return { success: true, directMessage: createdDirectMessage };
        }
      )
    )
  },
  Subscription: {
    newDirectMessage: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("NEW_DIRECT_MESSAGE"),
        (payload, args, { subCtx: { currentUser } }) =>
          currentUser.id === payload.receiverId ||
          payload.receiverId === args.receiverId
      )
    }
  },
  // Message
  DirectMessage: {
    sender: async ({ sender }, _, { models: { User } }) =>
      await User.findById(sender),
    receiver: async ({ receiver }, _, { models: { User } }) =>
      await User.findById(receiver)
  }
};
