import { gql } from '@apollo/client';

export const GET_EPHEMERAL_KEY = gql`
    query ($input: GetEphemeralKeyInput!) {
        getEphemeralKey(input: $input) {
            data {
                keyId
                keySecret
                createdAt
                expiresAt
            }
        }
    }
`;
