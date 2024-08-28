import { gql } from '@apollo/client';

export const GET_EPHEMERAL_KEY_QUERY = gql`
  query GetEphemeralKey($body: GetEphemeralKeyInput) {
    getEphemeralKey(body: $body) {
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
