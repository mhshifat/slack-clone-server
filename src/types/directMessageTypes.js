export default `
  type DirectMessage {
    id: ID!
    message: String!
    createdAt: String!
    sender: User!
    receiver: User!
  }

  input DirectMessageInput {
    receiverId: ID!
    message: String!
  }

  type DirectMessageResponse {
    success: Boolean!
    directMessage: DirectMessage
    errors: [Error!]
  }

  type Query {
    directMessages(receiverId: ID!): [DirectMessage!]!
  }

  type Mutation {
    createDirectMessage(data: DirectMessageInput!): DirectMessageResponse!
  }

  type Subscription {
    newDirectMessage(receiverId: ID!): DirectMessage!
  }
`;
