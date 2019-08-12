export default `
  type Channel {
    id: ID!
    name: String!
    public: Boolean!
    team: Team!
  }

  input ChannelInput {
    teamId: ID!
    name: String!
    public: Boolean
  }

  type ChannelResponse {
    success: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type Mutation {
    createChannel(data: ChannelInput!): ChannelResponse!
  }
`;
