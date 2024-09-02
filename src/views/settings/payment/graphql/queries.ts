import { gql } from '@apollo/client';

export const GET_EPHEMERAL_KEY_QUERY = gql`
  query Data {
    getEphemeralKey {
      data {
        createdAt
        expiresAt
        keyId
        keySecret
      }
      message
    }
  }
`;
