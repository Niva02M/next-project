import { gql } from '@apollo/client';

export const CREATE_BANK_ACCOUNT_LINK = gql`
  mutation CreateBankAccountLink($body: CreateBankAccountLinkInput!) {
    createBankAccountLink(body: $body) {
      created
      expires_at
      object
      url
    }
  }
`;

export const CREATE_CUSTOM_CONNECT_ACCOUNT = gql`
  mutation CreateCustomConnectAccount {
    createCustomConnectAccount {
      connectAccountId
      message
    }
  }
`;

export const CREATE_PAYMENT_INTENT = gql`
  mutation ($input: CreatePaymentIntentInput!) {
    createPaymentIntent(body: $input) {
      clientSecret
    }
  }
`;
