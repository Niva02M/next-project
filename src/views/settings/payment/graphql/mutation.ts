import { gql } from '@apollo/client';

export const SAVE_PAYMENT_METHOD = gql`
  mutation SavePaymentMethod($input: SavePaymentMethodDto!) {
    SavePaymentMethod(input: $input)
  }
`;

export const MAKE_CARD_DEFAULT_MUTATION = gql`
  mutation MakeCardDefault($body: MakePaymentMethodDefaultInput!) {
    makeCardDefault(body: $body) {
      message
    }
  }
`;

export const DELETE_CARD_DEFAULT_MUTATION = gql`
  mutation DeleteCard($body: DeletePaymentMethodInput!) {
    deleteCard(body: $body) {
      message
    }
  }
`;
