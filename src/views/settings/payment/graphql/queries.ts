import { gql } from '@apollo/client';

export const CREATE_INTENT_FOR_CUSTOMER_QUERY = gql`
  query CreateIntentForCustomer($kind: String) {
    createIntentForCustomer(kind: $kind) {
      clientSecret
    }
  }
`;

export const GET_ALL_CARDS_QUERY = gql`
  query GetCards {
    getCards {
      brand
      cardId
      country
      exp_month
      exp_year
      fingerprint
      funding
      is_default_source
      last4
      name
      userId
    }
  }
`;