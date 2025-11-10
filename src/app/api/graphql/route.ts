import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from 'graphql/schema';
import { resolvers } from 'graphql/resolvers';
import { GraphQLContext } from 'models/User';
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers
  // plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
