import { gql } from '@apollo/client';

export const ADD_CARD_FROM_TOKEN_MUTATION = gql`
  mutation AddCardFromToken($body: CreateCardInput!) {
    addCardFromToken(body: $body) {
      message
    }
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
  mutation DeleteCard($body: DeleteCardInput!) {
    deleteCard(body: $body) {
      message
    }
  }
`;
