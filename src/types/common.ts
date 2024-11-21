import { Profile, User } from "@utils";

export type AuthRoutes = {
  signupFlow: { screen: string; screenNumber: number };
  PasswordScreen: { email: string };
  signupp: undefined;
  authFlow: undefined;
  dobnote: undefined;
  login: undefined;
  emailRegistration: undefined;
  ConfirmPasswordScreen: { email: string };
  ForgotConfirmScreen: { email: string };
  signup: { email: string };
  OTP: undefined;
  UpdateOtp: { email: string };
  ForgotOtp: { email: string };
  forgotPassword: undefined;
  createPassword: { verifiedToken: string };
  accountInfo: undefined;
  selectGender: { screenNumber: number };
  userInfo: { screenNumber: number; isEdit: boolean };
  ResetPassword: { verifiedToken: string };
  createResetPasswordFlow: undefined;
  PasswordResetEmail: { isForgotPassword?: boolean };
  PasswordResetOTP: { email: string };
  SetResetPasswordFlow: {
    screen: string;
  };
  home: undefined;
  ProfileCompletion: undefined;
  selectReproductiveProcess: { screenNumber: number };
  selectReproductiveProcessFromList: undefined;
  ReproductiveProcessScreen: undefined;
  rpDonorPreferences: { multiSelect: boolean; rpStatus: string };
  medicalSetBacks: { screenNumber: number };
  medicalSetBacksCatogaries: undefined;
  logout: undefined;
  ConfirmLogout: undefined;
  profileManagementFlow: undefined;
  processType: undefined;
  profileManagement: undefined;
  accountSettingsFlow: undefined;
  accountSettings: undefined;
  editBio: { isEdit: boolean };
  changePasswordFlow: undefined;
  currentPassword: undefined;
  changePassword: undefined;
  changeEmail: undefined;
  changeEmailFlow: undefined;
  changeEmailOtp: undefined;

  rpJourneyFlow: undefined;
  rpJourney: undefined;
  updatedRpStatus: { donorPreferences: ReproductivePreferenceOption };
  updatedRpPrefrences: undefined;
  updatedMedicalSetbacksStatus: undefined;
  donorPreferences: {
    rpOptions: ReproductivePreferences;
    multiSelect: boolean;
  };
  updatedRpStatusFlow: undefined;
  subscribePlan: undefined;
  deleteAccount: undefined;
  deleteAccountFlow: undefined;
  confirmDeleteAccount: { reason: string };
};
export type LocalStorageKeysData = {
  user?: User;
  profile?: Profile;
  token?: string;
};

export type ReproductivePreferenceOption = {
  donorPreferrences?: ReproductivePreferences;
  multiSelect?: boolean;
  value: string;
  isSelected: boolean;
};

export type ReproductivePreferences = {
  [key: string]: ReproductivePreferenceOption;
};

export interface Confirmpasswordtype {
  password: string;
  Resetpassword: string;
}
