import { gql } from '@apollo/client';

// export const ADD_CARD_FROM_TOKEN_MUTATION = gql`
//   mutation AddCardFromToken($body: CreateCardInput!) {
//     addCardFromToken(body: $body) {
//       message
//     }
//   }
// `;

export const SAVE_PAYMENT_METHOD = gql`
  mutation SavePaymentMethod($input: SavePaymentMethodDto!) {
    SavePaymentMethod(input: $input)
  }
`;

export const MAKE_CARD_DEFAULT_MUTATION = gql`
  mutation MakeCardDefault($body: MakeCardDefaultInput!) {
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
