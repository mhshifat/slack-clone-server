import { skip } from "graphql-resolvers";

export default (_, __, { authenticatedUser }) =>
  authenticatedUser && authenticatedUser.id
    ? skip
    : new Error("Unauthenticated user!");
