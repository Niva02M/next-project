import { gql } from '@apollo/client';

export const GET_EPHEMERAL_KEY = gql`
  query ($input: GetEphemeralKeyInput!) {
    getEphemeralKey(input: $input) {
      data {
        keyId
        keySecret
        createdAt
        expiresAt
      }
    }
  }
`;

export const GET_MY_BANK_DETAIL = gql`
  query GetMyBankDetail {
    getMyBankDetail {
      paymentDetail {
        bankDetail {
          accountName
          accountNumber
          routingNumber
        }
        status
      }
      userId
    }
  }
`;