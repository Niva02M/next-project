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
  # query GetMyBankDetail {
  #   getMyBankDetail {
  #     paymentDetail {
  #       bankDetail {
  #         accountName
  #         accountNumber
  #         routingNumber
  #       }
  #       status
  #     }
  #     userId
  #   }
  # }
  query GetUserStripeAccountDetails {
    getUserStripeAccountDetails {
      accountId
      accountStatus
      accountType
      externalAccounts {
        account
        account_holder_name
        account_holder_type
        bank_name
        country
        currency
        default_for_currency
        id
        last4
        object
        routing_number
        status
      }
      verificationStatus
    }
  }
`;