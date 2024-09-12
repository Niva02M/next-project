import { gql } from '@apollo/client';

// export const GET_EPHEMERAL_KEY_QUERY = gql`
//   query Data {
//     getEphemeralKey {
//       data {
//         createdAt
//         expiresAt
//         keyId
//         keySecret
//       }
//       message
//     }
//   }
// `;

export const CREATE_INTENT_FOR_CUSTOMER_QUERY = gql`
  query CreateIntentForCustomer($kind: String) {
    createIntentForCustomer(kind: $kind) {
      clientSecret
    }
  }
`;