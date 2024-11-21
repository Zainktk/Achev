import { AuthenticatedLoginUser, ProfileInput, UserInput } from "@utils";
import { makeVar } from "@apollo/client";
import { ReproductivePreferences } from "@types";

export interface User {
  id: number;
  consentId: number;
  cardNumber: string;
  referenceId: string;
  status: string;
  active: boolean;
  banned: boolean;
  refA: string;
  refB: string;
  refC: string;
  refD: string;
  refE: string;
  firstName: string;
  preferredFirstName: string;
  middleName: string;
  lastName: string;
  otherLastName: string;
  name: string;
  dateOfBirth: string;
  genderID: number;
  email: string;
  emailNotProvided: boolean;
  optionToEmail: string;
  maritalStatusId: number;
  street: string;
  street2: string;
  zip: string;
  city: string;
  stateId: number;
  countryId: number;
  homePhone: string;
  mobilePhone: string | null;
  workPhone: string;
  workExt: string;
  familyFriendPhone: string;
  preferredContact: string;
  optionToSMS: string;
  employmentStatusId: number | null | undefined;
  countryOfOriginId: number;
  sourceId: number;
  highestEducationLevelId: number;
  educationOutsideOfCanadaId: number;
  statusInCanadaId: number;
  newcomer: boolean;
  internetAtHome: string;
  understandsEnglishId: number;
  understandsEnglishAssistance: string;
  underStandsFrenchId: number;
  preferredLanguageOfServiceId: number;
  reasonForContact: string;
  initialProgramRequestId: number;
  notes: string;
  hasDriversLicense: string;
  hasVehicleAccess: string;
  hasPublicTransportAccess: string;
  hasSinNumber: string;
  baseline: string;
  jobExperience: string;
  workPermitId: number;
  typeOfWorkId: number;
  initialDestination: string;
  canadaArrivalDate: string;
  firstLanguageId: number;
  credentialEvaluationServiceUsed: string;
  otherCredentialEvaluationServiceUsed: string;
  sourceOfIncomeId: number;
  someFinanceITExperienceOrTraining: boolean;
  originalOccupationId: number;
  currentOccupationId: number;
  intendedOccupationId: number;
  lastPositionInCanada: string;
  totalJobsLastYear: string;
  lastDayPaidEmployment: string;
  reasonForLeaving: string;
  referralSourceId: number;
  hasWorkPermit: string;
  employmentServiceId: number;
  preferredWorkId: number;
  trade: string;
  tradeYearEnrolledOrCompleted: string;
  educationStatusId: number;
  educationInstitutionName: string;
  educationInstitutionProgram: string;
  otherServiceProvider: string;
  educationDegree: string;
  educationCourse: string;
  educationCountry: number;
  reasonForLearningEnglishId: number;
  learningDisability: string;
  referringAgency: string;
  languageAssessmentDate: string;
  benchmarkListening: string;
  benchmarkSpeaking: string;
  benchmarkReading: string;
  benchmarkWriting: string;
  hartsReferenceId: number;
  skypeId: string;
  studyMethod: string;
  educationStartDate: string;
  educationEndDate: string;
  additionalEducationId: number;
  additionalEducationInstitutionName: string;
  additionalEducationInstitutionProgram: string;
  additionalEducationStartDate: string;
  additionalEducationEndDate: string;
  additionalEducationCountry: number;
  reasonForOnsiteTraining: string;
  pronounId: number;
  accomodationId: number;
  reasonForLearningOnline: string;
  createUId: number;
  createdDate: string;
  writeUId: number;
  writeDate: string;
  placementStartDate: string;
  placementEndDate: string;
  position: string;
  hoursPerWeek: number;
  wageRate: number;
  jobCoach: number;
  outCome: string;
  interimNote1: string;
  interimNote2: string;
  finalNotes: string;
  cohort: number;
  internalCohortIdNum: number;
  areaOfInterest: string;
  contest: boolean;
  password: string;
  isActive: boolean;
  identifier: string | null;
  rmdCode: number;
  designatedGroupsID: number[] | null;
}

export const userData = makeVar<User | null>(null);
export const NewuserData = makeVar<User | null>(null);
export const UserEmail = makeVar<string>("");
export const UserPassword = makeVar<string>("");
export const VerificationToken = makeVar<string>("");
export const VerifiedToken = makeVar<string>("");
export const AuthenticationToken = makeVar<string>("");
export const RpStatus = makeVar<boolean>(false);
export const MedicalSetbacksStatus = makeVar<boolean>(false);
export const SelecteRpStatus = makeVar<{ [key: string]: string }>({});
export const SelectedMedicalPreferences = makeVar<{ [key: string]: string }>(
  {}
);
export const SelectedDonorPreferences = makeVar<ReproductivePreferences>({});
export const Userinfo = makeVar<UserInput | null>({
  firstName: "",
  lastName: "",
  password: "",
});
export const ProfileInfo = makeVar<ProfileInput>({
  nickName: "",
  phone: "",
  state: "",
  dob: "",
  gender: "",
  reproductiveStatus: "",
  reproductivePreferences: [],
  medicalSetbacks: [],
});
export const IsForgotPasswordFlow = makeVar<boolean>(false);
export const LoggedInUser = makeVar<AuthenticatedLoginUser | null | undefined>(
  undefined
);
export const globalSuccessMessageVariable = makeVar<{ message: string | null }>(
  {
    message: null,
  }
);
export const globalErrorMessageVariable = makeVar<{ message: string | null }>({
  message: null,
});
export const STEPS = makeVar<string[]>([]);

export const initialRpStatusForUpdate = {
  "Not Undergoing": {
    value: "Not Undergoing",
    isSelected: false,
  },
  IUI: {
    value: "IUI",
    isSelected: false,
    multiSelect: false,
    donorPreferrences: {
      "Partner's Sperm": { value: "Partner's Sperm", isSelected: false },
      "Donor Sperm": { value: "Donor Sperm", isSelected: false },
    },
  },
  IVF: {
    value: "IVF",
    isSelected: false,
    multiSelect: true,
    donorPreferrences: {
      "Partner's Sperm": { value: "Partner's Sperm", isSelected: false },
      "Donor Sperm": { value: "Donor Sperm", isSelected: false },
      "Own Egg": { value: "Own Egg", isSelected: false },
      "Donor Egg": { value: "Donor Egg", isSelected: false },
    },
  },
  "Egg Freezing only": { value: "Egg Freezing only", isSelected: false },

  "Adoption (of a child)": {
    isSelected: false,
    value: "Adoption (of a child)",
  },
  "Adoption (of a embryo)": {
    isSelected: false,
    value: "Adoption (of a embryo)",
    multiSelect: false,
    donorPreferrences: {
      "Already have an embryo": {
        value: "Already have an embryo",
        isSelected: false,
      },
      "Seeking an embryo": { value: "Seeking an embryo", isSelected: false },
    },
  },
  "Surrogate (with my partner)": {
    value: "Surrogate (with my partner)",
    isSelected: false,
    multiSelect: true,
    donorPreferrences: {
      "Partner's Sperm": { value: "Partner's Sperm", isSelected: false },
      "Donor Sperm": { value: "Donor Sperm", isSelected: false },
      "Own Egg": { value: "Own Egg", isSelected: false },
      "Donor Egg": { value: "Donor Egg", isSelected: false },
    },
  },
  "Surrogate (for a couple)": {
    isSelected: false,
    value: "Surrogate (for a couple)",
    multiSelect: false,
    donorPreferrences: {
      "Donating my own egg": {
        value: "Donating my own egg",
        isSelected: false,
      },
      "Using mother egg": { value: "Using mother egg", isSelected: false },
    },
  },
  // Other: { value: "Other", isSelected: false },
};

export const initialDonorPreferences: ReproductivePreferences = {};

export const initialMedicalSetbacksForUpdate = {
  "No Medical Setbacks": { value: "No Medical Setbacks", isSelected: false },
  PCOS: { value: "PCOS", isSelected: false },
  Endometriosis: { value: "Endometriosis", isSelected: false },
  Polyps: { value: "Polyps", isSelected: false },
  "Autoimmune Condition": { value: "Autoimmune Condition", isSelected: false },
  Other: { value: "Other", isSelected: false },
};

export const initialRpPreferencesForUpdate = {
  None: { value: "None", isSelected: false },
  "Unknown Egg Donor": { value: "Unknown Egg Donor", isSelected: false },
  "Known Egg Donor": { value: "Known Egg Donor", isSelected: false },
  "Unknown Sperm Donor": { value: "Unknown Sperm Donor", isSelected: false },
  "Known Sperm Donor": { value: "Known Sperm Donor", isSelected: false },
  Other: { value: "", isSelected: false },
};

export const onBoarding = makeVar<string | undefined | null>(undefined);
export const userToken = makeVar<string | undefined | null>(undefined);
export const initialToken = makeVar<string | undefined | null>(undefined);
export const newUser = makeVar<string | undefined | null>(undefined);
export const statusCanada = makeVar<number | null>(null);
export const Designated = makeVar<number[] | null>(null);
export const Employment = makeVar<number | null | undefined>(undefined);
export const GenderValue = makeVar<number | null>(null);

export const selectedStatusInCanadaVar = makeVar<number | null>(null);
export const selectedEmploymentStatusVar = makeVar<number | null>(null);
export const selectedGenderVar = makeVar<number | null>(null);
export const selectedDesignatedGroupsVar = makeVar<number[] | null>(null);
export const AppliedPrograms = makeVar<string[] | null>([]);
export const notificationVar = makeVar<any[] | null>([]);
export const NotifiAllowed = makeVar<boolean | undefined>(undefined);
export const PushEnabled = makeVar<boolean | null>(null);
export const NotifiScreenVisited = makeVar<boolean | undefined | null>(
  undefined
);
