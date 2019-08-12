export default `
  type User {
    id: ID!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type LoginResponse {
    success: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }

  type RegisterResponse {
    success: Boolean!
    user: User
    errors: [Error!]
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User!
    getUsers: [User!]!
  }

  type Mutation {
    login(data: LoginInput!): LoginResponse!
    register(data: RegisterInput!): RegisterResponse!
  }
`;
