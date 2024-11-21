import { gql } from "@apollo/client";
import { PROFILE_FIELDS, USER_FIELDS } from "./fragments";

export const SEND_VERIFICATION_CODE = gql`
  mutation SendVerificationCode($email: String!) {
    sendVerificationCode(email: $email) {
      token
    }
  }
`;

export const USER_SIGNUP = gql`
  ${USER_FIELDS}
  ${PROFILE_FIELDS}
  mutation UserSignup(
    $userDetails: UserInput!
    $token: String!
    $profileDetails: ProfileInput!
  ) {
    userSignup(
      userDetails: $userDetails
      token: $token
      profileDetails: $profileDetails
    ) {
      user {
        ...UserFields
      }
      profile {
        ...ProfileFields
      }
      token
    }
  }
`;

export const SEND_RESET_VERIFICATION_CODE = gql`
  mutation SendResetVerificationCode($email: String!) {
    sendResetVerificationCode(email: $email) {
      token
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($profile: ProfileInput, $user: UpdateUserInput) {
    updateProfile(profile: $profile, user: $user) {
      success
    }
  }
`;
export const VERIFY = gql`
  mutation verify($code: String!, $token: String!) {
    verify(code: $code, token: $token) {
      token
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      success
    }
  }
`;
export const LOGIN = gql`
  ${USER_FIELDS}
  ${PROFILE_FIELDS}
  mutation Login($user: CredentialInput!) {
    login(user: $user) {
      user {
        ...UserFields
      }
      profile {
        ...ProfileFields
      }
      token
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($token: String!) {
    updateEmail(token: $token) {
      success
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($reason: String!) {
    deleteUser(reason: $reason) {
      success
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($newPassword: String!, $currentPassword: String!) {
    updatePassword(
      newPassword: $newPassword
      currentPassword: $currentPassword
    ) {
      success
    }
  }
`;
