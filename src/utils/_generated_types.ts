export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: any; output: any };
};

export type Query = {
  __typename?: "Query";
  ping: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  sendVerificationCode: Verification;
  verify: Verification;
  sendResetVerificationCode: Verification;
  login: AuthenticatedLoginUser;
  userSignup: AuthenticatedLoginUser;
  updateProfile: Success;
  resetPassword: Success;
  updatePassword: Success;
  updateEmail: Success;
  deleteUser: Success;
};

export type MutationSendVerificationCodeArgs = {
  email: Scalars["String"]["input"];
};

export type MutationVerifyArgs = {
  code: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

export type MutationSendResetVerificationCodeArgs = {
  email: Scalars["String"]["input"];
};

export type MutationLoginArgs = {
  user: CredentialInput;
};

export type MutationUserSignupArgs = {
  profileDetails: ProfileInput;
  userDetails: UserInput;
  token: Scalars["String"]["input"];
};

export type MutationUpdateProfileArgs = {
  profile?: InputMaybe<ProfileInput>;
  user?: InputMaybe<UpdateUserInput>;
};

export type MutationResetPasswordArgs = {
  newPassword: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

export type MutationUpdatePasswordArgs = {
  newPassword: Scalars["String"]["input"];
  currentPassword: Scalars["String"]["input"];
};

export type MutationUpdateEmailArgs = {
  token: Scalars["String"]["input"];
};

export type MutationDeleteUserArgs = {
  reason: Scalars["String"]["input"];
};

/** Verification Code */
export type Verification = {
  __typename?: "Verification";
  token: Scalars["String"]["output"];
};

/** Authenticated login user, and access jwt token */
export type AuthenticatedLoginUser = {
  __typename?: "AuthenticatedLoginUser";
  user: User;
  profile?: Maybe<Profile>;
  token: Scalars["String"]["output"];
};

/** User object */
export type User = {
  __typename?: "User";
  id: Scalars["ID"]["output"];
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  lastName: Scalars["String"]["output"];
  apnsToken?: Maybe<Scalars["String"]["output"]>;
  fcmToken?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  roleId: Scalars["String"]["output"];
};

/** Profile object */
export type Profile = {
  __typename?: "Profile";
  id: Scalars["ID"]["output"];
  nickName?: Maybe<Scalars["String"]["output"]>;
  photo?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  emergencyName?: Maybe<Scalars["String"]["output"]>;
  phone?: Maybe<Scalars["String"]["output"]>;
  gender?: Maybe<Gender>;
  dob?: Maybe<Scalars["DateTime"]["output"]>;
  reproductiveStatus?: Maybe<Scalars["String"]["output"]>;
  reproductivePreferences?: Maybe<Array<Scalars["String"]["output"]>>;
  medicalSetbacks?: Maybe<Array<Scalars["String"]["output"]>>;
  userObjective?: Maybe<Scalars["String"]["output"]>;
  isProcessInProgress?: Maybe<Scalars["Boolean"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  userId: Scalars["ID"]["output"];
};

export enum Gender {
  Male = "male",
  Female = "female",
}

export type CredentialInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type ProfileInput = {
  nickName?: InputMaybe<Scalars["String"]["input"]>;
  photo?: InputMaybe<Scalars["String"]["input"]>;
  emergencyName?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  dob?: InputMaybe<Scalars["DateTime"]["input"]>;
  gender?: InputMaybe<Gender>;
  reproductiveStatus?: InputMaybe<Scalars["String"]["input"]>;
  reproductivePreferences?: InputMaybe<Array<Scalars["String"]["input"]>>;
  medicalSetbacks?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type UserInput = {
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

/** Generic success response */
export type Success = {
  __typename?: "Success";
  /** true if operation was succesful */
  success: Scalars["Boolean"]["output"];
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
};
