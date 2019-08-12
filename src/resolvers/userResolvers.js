import { combineResolvers } from "graphql-resolvers";
import {
  generateTokensForLogin,
  validateLoginDataFields,
  validateLoginDataWithDb
} from "../helpers/userHelpers";
import catchAsync from "../utils/catchAsync";
import createErrorMessages from "../utils/createErrorMessages";
import isAuthenticated from "../utils/isAuthenticated";

export default {
  // Queries
  Query: {
    me: combineResolvers(
      isAuthenticated,
      catchAsync(
        async (_, __, { models: { User }, authenticatedUser }) =>
          await User.findById(authenticatedUser.id)
      )
    ),
    getUsers: catchAsync(
      async (_, __, { models: { User } }) => await User.find({})
    )
  },
  // Mutations
  Mutation: {
    login: catchAsync(async (_, { data }, { models: { User } }) => {
      const { isValid, errors } = validateLoginDataFields(data);
      if (!isValid) return createErrorMessages(null, null, errors);
      const {
        isValid: isDataValid,
        errors: dataErrors
      } = await validateLoginDataWithDb(data, User);
      if (!isDataValid) return createErrorMessages(null, null, dataErrors);
      const { token, refreshToken } = await generateTokensForLogin(data, User);
      return { success: true, token, refreshToken };
    }),
    register: catchAsync(async (_, { data }, { models: { User } }) => {
      const createdUser = await User.create(data);
      return { success: true, user: createdUser };
    })
  },
  // User
  User: {
    teams: async ({ id }, _, { models: { Team, Member } }) => {
      const members = await Member.find({ user: id });
      const teamIds = members.map(m => m.team);
      const invitedTeams = await Team.find({ _id: { $in: teamIds } });
      const teams = await Team.find({ owner: id });
      return [...new Set([...teams, ...invitedTeams])];
    }
  }
};
