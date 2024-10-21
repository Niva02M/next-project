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