import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation registerUser($input: SignupInput!) {
    registerUser(body: $input) {
      message
      expiry {
        expiresBy
        expiresAt
      }
      user {
        _id
        email
        status
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation loginWithEmailPassword($input: LoginEmailPasswordInput!) {
    loginWithEmailPassword(input: $input) {
      message
      expiry {
        expiresBy
        expiresAt
      }
      token {
        accessToken
        accessTokenExpiresIn
        refreshToken
        refreshTokenExpiresIn
      }
      user {
        _id
        email
        status
      }
    }
  }
`;
