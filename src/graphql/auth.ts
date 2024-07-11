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
  mutation loginWithEmailPassword($body: LoginEmailPasswordInput!) {
    loginWithEmailPassword(body: $body) {
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

export const FACEBOOK_SIGNIN_MUTATION = gql`
  mutation loginWithFacebook($body: LoginFacebookInput!) {
    loginWithFacebook(body: $body) {
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

export const GOOGLE_SIGNIN_MUTATION = gql`
  mutation loginWithGoogle($body: LoginGoogleInput!) {
    loginWithGoogle(body: $body) {
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
