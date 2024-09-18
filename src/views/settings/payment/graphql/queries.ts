import { gql } from '@apollo/client';

export const CREATE_INTENT_FOR_CUSTOMER_QUERY = gql`
  query CreateIntentForCustomer($kind: String) {
    createIntentForCustomer(kind: $kind) {
      clientSecret
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query PaymentMethods {
    getMyPaymentMethods {
      paymentMethods {
        billing_details {
          name
        }
        id
        method {
          exp_month
          exp_year
          last4
          paymentMethod
        }
      }
      defaultMethod
    }
  }
`;