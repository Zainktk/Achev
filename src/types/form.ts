// types for local storage keys and values

import { Professions, User } from "graphql-client/generated_types";

export type LocalStorageKeys = {};

// types to be used in about you form
export type AboutUser = {
  firstName: string;
  lastName: string;
  nickName: string;
  emergencyNo: string;
  state: string;
};

export type CreatePassword = {
  password: string;
  confirmPassword: string;
};
export type WatchFields = User | CreatePassword | BusinessCategory;

export type VerifyCode = {
  language: string;
  code: string;
  token: string;
};

export type AddService = {
  subCatogary: string;
  serviceName: string;
  customServiceName: string;
  servicePrice: number;
  serviceDuration: number;
  isCustomService: boolean;
};
export type BusinessCategory = {
  gender: string;
};
export type BusinessLocation = {
  isBusinessLocation: boolean;
  isClientLocation: boolean;
};
