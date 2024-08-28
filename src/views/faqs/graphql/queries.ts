import { gql } from '@apollo/client';

export const GET_ALL_FAQ_QUERY = gql`
  query GetAllFAQ($input: GetFAQDto!) {
    getAllFAQ(input: $input) {
      message
      pagination {
        hasNextPage
        total
      }
      faqs {
        _id
        content {
          _id
          answer
          question
        }
        # createdAt
        description
        section
        # updatedAt
      }
    }
  }
`;
