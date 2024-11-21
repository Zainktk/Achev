import { gql } from "@apollo/client";

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    apnsToken
    fcmToken
    createdAt
    updatedAt
    roleId
  }
`;
export const PROFILE_FIELDS = gql`
  fragment ProfileFields on Profile {
    id
    nickName
    emergencyName
    photo
    state
    phone
    gender
    dob
    reproductiveStatus
    reproductivePreferences
    medicalSetbacks
    userObjective
    isProcessInProgress
    createdAt
    updatedAt
    userId
  }
`;

export const BUSINESS_DETAILS_FIELDS = gql`
  fragment BusinessDetailsFields on BusinessDetails {
    id
    name
    isBusinessLocation
    isClientLocation
    isMenService
    isWomenService
    profession
    address
    district
    city
    timeZone
    description
    autoAppointmentsEnabled
    location {
      lat
      lng
    }
    schedule
    images
    coverPhoto
    rating
    count
    userId
    serviceOfferings {
      id
      name
      greekName
      price
      duration
      serviceId
      businessId
    }
    employees {
      id
      schedule
      photo
      unAvailabilities
      isAvailable
      timeZone
      autoAppointmentsEnabled
      userId
    }
  }
`;
