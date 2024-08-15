import { gql } from "@apollo/client";

export const GET_PROFILE_QUERY = gql`
  query Me {
    me {
      _id
      authProvider
      authProviderId
      firstName
      lastName
      loginFlowType
      profileImage
    }
  }
`;
