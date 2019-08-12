export default `
  type Message {
    id: ID!
    message: String!
    createdAt: String!
    user: User!
    channel: Channel!
  }

  input MessageInput {
    channelId: ID!
    message: String!
  }

  type MessageResponse {
    success: Boolean!
    message: Message
    errors: [Error!]
  }

  type Query {
    messages(channelId: ID!): [Message!]!
  }

  type Mutation {
    createMessage(data: MessageInput!): MessageResponse!
  }

  type Subscription {
    newMessage(channelId: ID!): Message!
  }
`;
