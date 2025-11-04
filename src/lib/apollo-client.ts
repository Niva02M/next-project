import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_ENDPOINT || '/api/graphql',
    fetch: fetch as any
  }),
  cache: new InMemoryCache()
});

export default client;
