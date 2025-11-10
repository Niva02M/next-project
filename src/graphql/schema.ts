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
    emailVerified: Boolean
    deviceId: String
    provider: String
    image: String
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
  input VerifyOtpInput {
    email: String!
    otp: String!
  }
  input UpdateProfileInput {
    firstName: String
    lastName: String
    image: String
  }
  # ---------- Auth Responses ----------
  type AuthResponse {
    message: String
    expiry: Expiry
    token: Token
    user: User
    status: String
    code: String
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

  type UpdateProfileResponse {
    message: String
    user: User
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }
  input ResendVerifyOtpInput {
    email: String!
    deviceId: String
  }

  type ResendVerifyOtpResponse {
    message: String!
    expiry: Expiry!
  }

  # ---------- Root Schema ----------
  type Query {
    hello: String
    me: User
  }

  type Mutation {
    registerUser(body: SignupInput!): RegisterResponse
    loginUser(body: LoginInput!): AuthResponse
    verifyOtp(body: VerifyOtpInput!): AuthResponse!
    updateProfile(body: UpdateProfileInput!): UpdateProfileResponse
    changePassword(body: ChangePasswordInput!): UpdateProfileResponse
    resendVerifyOtp(body: ResendVerifyOtpInput!): ResendVerifyOtpResponse!
  }
`;
