import { combineResolvers } from "graphql-resolvers";
import catchAsync from "../utils/catchAsync";
import isAuthenticated from "../utils/isAuthenticated";

export default {
  // Queries
  Query: {},
  // Mutations
  Mutation: {
    createChannel: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (_, { data: { teamId, ...rest } }, { models: { Channel } }) => {
          const createdChannel = await Channel.create({
            ...rest,
            team: teamId
          });
          return { success: true, channel: createdChannel };
        }
      )
    )
  },
  // Channel
  Channel: {
    team: async ({ team }, _, { models: { Team } }) => await Team.findById(team)
  }
};
