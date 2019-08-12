import { combineResolvers } from "graphql-resolvers";
import mongoose from "mongoose";
import { validateAddMemberToTeamFields } from "../helpers/teamHelpers";
import catchAsync from "../utils/catchAsync";
import createErrorMessages from "../utils/createErrorMessages";
import isAuthenticated from "../utils/isAuthenticated";

export default {
  // Queries
  Query: {},
  // Mutations
  Mutation: {
    createTeam: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (
          _,
          { name },
          { models: { Team, Channel }, authenticatedUser }
        ) => {
          let createdTeam;
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            const teams = await Team.create(
              [
                {
                  name,
                  owner: authenticatedUser.id
                }
              ],
              { session }
            );
            await Channel.create(
              [
                { name: "general", team: teams[0].id },
                { name: "random", team: teams[0].id }
              ],
              { session }
            );
            createdTeam = teams[0];
          });
          return { success: true, team: createdTeam };
        }
      )
    ),
    addMemberToTeam: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (
          _,
          { data: { teamId, email } },
          { models: { Member, User }, authenticatedUser }
        ) => {
          const { isValid, errors, user } = await validateAddMemberToTeamFields(
            email,
            authenticatedUser,
            teamId,
            User,
            Member
          );
          if (!isValid) return createErrorMessages(null, null, errors);
          await Member.create({ team: teamId, user: user.id });
          return { success: true, member: user };
        }
      )
    )
  },
  // Team
  Team: {
    owner: async ({ owner }, _, { models: { User } }) =>
      await User.findById(owner),
    channels: async ({ id }, _, { models: { Channel } }) =>
      await Channel.find({ team: id }),
    members: async (
      { id, owner },
      _,
      { models: { Member, User }, authenticatedUser }
    ) => {
      const teamOwner = await User.findById(owner);
      const members = await Member.find({
        team: id,
        user: { $ne: authenticatedUser && authenticatedUser.id }
      });
      const memberIds = members.map(m => m.user);
      const allMembers = await User.find({ _id: { $in: memberIds } });
      const result = [...allMembers];
      if (authenticatedUser && authenticatedUser.id !== teamOwner.id) {
        result.push(teamOwner);
      }
      return result;
    },
    users: async (
      _,
      __,
      { models: { DirectMessage, User }, authenticatedUser }
    ) => {
      const isAuthenticatedUser =
        authenticatedUser !== null ? authenticatedUser.id : null;
      const allDirectMessages = await DirectMessage.find({
        sender: isAuthenticatedUser
      });
      const allDirectMsgIds = allDirectMessages.map(item =>
        item.receiver.toString()
      );
      const hasAnyOneDmMe = await DirectMessage.find({
        receiver: isAuthenticatedUser
      });
      const hasAnyOneDmMeIds = hasAnyOneDmMe.map(item =>
        item.sender.toString()
      );
      hasAnyOneDmMeIds.forEach(id => allDirectMsgIds.push(id));
      const filteredAddDmIds = [...new Set(allDirectMsgIds)];
      return await User.find({ _id: { $in: filteredAddDmIds } });
    }
  }
};
