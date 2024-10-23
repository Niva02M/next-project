import { gql } from '@apollo/client';

export const GENERATE_ACCOUNT_ONBOARDING_LINK = gql`
  mutation GenerateAccountOnboardingLink($body: CreateBankAccountLinkInput!) {
    generateAccountOnboardingLink(body: $body) {
      created
      expires_at
      object
      url
    }
  }
`;

export const CREATE_CUSTOM_CONNECT_ACCOUNT = gql`
  mutation GenerateCustomAccountOnboardingLink {
    generateCustomAccountOnboardingLink {
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

export const CREATE_CUSTOM_STRIPE_ACCOUNT = gql`
  mutation CreateCustomStripeAccount($body: CreateBankDetailInput!) {
    createCustomStripeAccount(body: $body) {
      message
    }
  }
`;

export const DELETE_USER_BANK_ACCOUNT = gql`
  mutation DeleteUserBankAccount($bankId: String!) {
    deleteUserBankAccount(bankId: $bankId) {
      message
    }
  }
`;

export const DELETE_STRIPE_CONNECT_ACCOUNT = gql`
  mutation DeleteStripeConnectAccount($connectAccountId: String!) {
    deleteStripeConnectAccount(connectAccountId: $connectAccountId) {
      message
    }
  }
`;

export const ADD_USER_BANK_ACCOUNT_FROM_DETAIL = gql`
  mutation AddUserBankAccountFromDetail($body: CreateBankTokenInput!) {
    addUserBankAccountFromDetail(body: $body) {
      message
    }
  }
`;

export const UPDATE_DEFAULT_BANK_ACCOUNT = gql`
  mutation UpdateDefaultBankAccount($bankId: String!) {
    updateDefaultBankAccount(bankId: $bankId) {
      message
    }
  }
`;