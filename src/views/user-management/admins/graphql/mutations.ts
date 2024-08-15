import { gql } from "@apollo/client";

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($body: UpdateUserProfile!) {
    updateProfile(body: $body) {
      message
      user {
        _id
        authProvider
        authProviderId
        firstName
        lastName
        profileImage
      }
    }
  }
`;
