export default `
  type Team {
    id: ID!
    name: String!
    owner: User!
    channels: [Channel!]!
    members: [User!]!
    users: [User!]!
  }

  input MemberInput {
    teamId: ID!
    email: String!
  }

  type TeamResponse {
    success: Boolean!
    team: Team
    errors: [Error!]
  }

  type MemberResponse {
    success: Boolean!
    member: User
    errors: [Error!]
  }

  type Mutation {
    createTeam(name: String!): TeamResponse!
    addMemberToTeam(data: MemberInput!): MemberResponse!
  }
`;
