import { gql } from '@apollo/client';

export const GET_PROFILE_QUERY = gql`
  query Me {
    me {
      _id
      email
      firstName
      lastName
      provider
      status
      image
    }
  }
`;

export const GET_PRESIGNED_URL = gql`
  query GetPreSignedUrl($input: PreSignedUrlInput!) {
    getPreSignedUrl(input: $input) {
      message
      url
    }
  }
`;
