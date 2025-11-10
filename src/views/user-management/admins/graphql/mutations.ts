import { gql } from '@apollo/client';

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($body: UpdateProfileInput!) {
    updateProfile(body: $body) {
      message
      user {
        _id
        email
        firstName
        lastName
        provider
        status
      }
    }
  }
`;

export const ADMIN_CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($body: ChangePasswordInput!) {
    changePassword(body: $body) {
      message
    }
  }
`;
