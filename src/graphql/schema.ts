import { gql } from '@apollo/client';

export const typeDefs = gql`
  # ---------- Shared Types ----------
  type Phone {
    dialCode: String
    number: String
  }

  input PhoneInput {
    dialCode: String!
    number: String!
  }

  type Expiry {
    expiresAt: String
    expiresBy: Float
  }

  type Token {
    accessToken: String
    refreshToken: String
    accessTokenExpiresIn: Int
    refreshTokenExpiresIn: Int
  }

  # ---------- User ----------
  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String!
    status: String
    phoneNumber: Phone
    deviceId: String
    provider: String
  }

  # ---------- Auth Inputs ----------
  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phoneNumber: PhoneInput!
    deviceId: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  # ---------- Auth Responses ----------
  type AuthResponse {
    message: String
    expiry: Expiry
    token: Token
    user: User
  }

  type RegisterResponse {
    user: User
    expiry: Expiry
    message: String
  }

  type LoginResponse {
    message: String
    user: User
  }
  # ---------- Root Schema ----------
  type Query {
    hello: String
    me: User
  }

  type Mutation {
    registerUser(body: SignupInput!): RegisterResponse
    loginUser(body: LoginInput!): AuthResponse
  }
`;
