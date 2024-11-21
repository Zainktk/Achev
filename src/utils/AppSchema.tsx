import * as Yup from "yup";
// const phoneRegExp = /^[+]*\(?[0-9]{1,4}\)?[-\s./0-9]*$/g;
const phoneRegExp = /^[2-9][0-9]{2}-[0-9]{3}-[0-9]{4}$/;

export const GenericSchema = {
  firstName: Yup.string()
    .max(64, "First Name cannot exceed 64 characters")
    .required("First Name is required")
    .test(
      "no-numbers",
      "First Name should not contain numbers",
      (value) => !value || /^[^\d]+$/.test(value) // Allow empty string or validate
    ),
  lastName: Yup.string()
    .max(64, "Last Name cannot exceed 64 characters")
    .required("Last Name is required")
    .test(
      "no-numbers",
      "Last Name should not contain numbers",
      (value) => !value || /^[^\d]+$/.test(value) // Allow empty string or validate
    ),
  nickName: Yup.string()
    .max(64)
    .matches(/^[^\d]+$/, "Nick Name should not contain numbers")
    .required("Nick Name is required"),
  emergencyContactName: Yup.string()
    .max(64)
    .matches(/^[^\d]+$/, "Emergency Name should not contain numbers")
    .required("Emergency Name is required"),
  businessName: Yup.string().max(64).required("Business Name is required"),
  phoneNum: Yup.string()
    .required("Please enter your phone number in the format of 416-555-5555")
    .matches(
      phoneRegExp,
      "Phone number must be 10 digits with dashes, starting with digit greater than 1 (e.g., 416-555-5555)"
    ),
  email: Yup.string()
    .email("Must be a valid email")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email address"
    )
    .max(64)
    .required("Email is required"),
  matchedEmail: Yup.string()
    .email("Must be a valid email")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email address"
    )
    .max(64)
    .oneOf([Yup.ref("email")], "Emails do not match")
    .required("Email is required"),
  password: Yup.string()
    .required()
    .min(8, "Password must be at least 8 characters long")
    .max(32)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least 1 capital letter and 1 number"
    ),
  matchPassowrd: Yup.string()
    .required("This field is mandatory")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
  currentPassword: Yup.string().required("current Password is required "),
  string: Yup.string(),
  reqString: Yup.string().required(),
  maxString: Yup.string().max(64),
  maxRequiredString: (name?: string) =>
    name
      ? Yup.string().max(64).required(`${name} is required`)
      : Yup.string().max(64).required(),
  requiredString: (name?: string) =>
    name
      ? Yup.string().required(`${name} is required`)
      : Yup.string().required(),
  dob: Yup.string()
    .required("This field is mandatory")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD")
    .test("is-valid-date", "Invalid date", (value) => {
      return value ? !isNaN(new Date(value).getTime()) : true;
    }),
  Dob: Yup.string().optional(),
  privacyPolicy: Yup.boolean().required(),
  postalCode: Yup.string()
    .matches(
      /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      "Please enter your Canadian postal code in the format A1A1A1"
    )
    .required("Postal Code is required"),

  statusInCanada: Yup.string(),
  gender: Yup.string(),
  arrivalDate: Yup.string().optional(),
  benchmark_listening: Yup.string(),
  benchmark_reading: Yup.string(),
  benchmark_speaking: Yup.string(),
  benchmark_writing: Yup.string(),
  hasWorkPermit: Yup.string(),
  someFinanceITExperienceOrTraining: Yup.string(),
  StatusCanada: Yup.string(),
  EmploymentStatus: Yup.string(),
  Gender: Yup.string(),
  DesignatedGroup: Yup.string(),
  sourceOfIncomeId: Yup.string(),
  state: Yup.string(),
  educationOutside: Yup.string(),
  educationStatus: Yup.string(),
  preferredLang: Yup.string(),
  UnderstandEnglish: Yup.string(),
  highestEducation: Yup.string(),
};
export const createUserInfo = Yup.object({
  firstName: GenericSchema.firstName,
  lastName: GenericSchema.lastName,
  nickName: GenericSchema.string,
  emergencyNo: GenericSchema.phoneNum,
  emergencyContactName: GenericSchema.emergencyContactName,
  state: GenericSchema.reqString,
  dob: GenericSchema.dob,
  agreePrivacyPolicy: GenericSchema.privacyPolicy,
});
export const editUserInfo = Yup.object({
  firstName: GenericSchema.firstName,
  lastName: GenericSchema.lastName,
  nickName: GenericSchema.string,
  emergencyNo: GenericSchema.phoneNum,
  emergencyContactName: GenericSchema.emergencyContactName,
  state: GenericSchema.reqString,
  dob: GenericSchema.string,
});
export const createPassword = Yup.object({
  password: GenericSchema.password,
  confirmPassword: GenericSchema.matchPassowrd,
});
export const changeEmail = Yup.object({
  email: GenericSchema.email,
  matchedEmail: GenericSchema.matchedEmail,
});

export const changeCurrentPassword = Yup.object({
  currentPassword: GenericSchema.requiredString("password is  required"),
  password: GenericSchema.password,
  confirmPassword: GenericSchema.matchPassowrd,
});
export const loginSchema = Yup.object({
  email: GenericSchema.email,
  // password: Yup.string(),
});

export const PassowordSchema = Yup.object({
  password: Yup.string(),
});

export const enterEmail = Yup.object({
  firstName: GenericSchema.firstName,
  lastName: GenericSchema.lastName,
  email: GenericSchema.email,
  password: GenericSchema.password,
  confirmPassword: GenericSchema.matchPassowrd,
  phonenumber: GenericSchema.phoneNum,
  dob: GenericSchema.dob,
  postalCode: GenericSchema.postalCode,
});

export const editName = Yup.object({
  firstName: GenericSchema.firstName,
});

export const editPassword = Yup.object({
  Password: GenericSchema.password,
});

export const editLastName = Yup.object({
  lastName: GenericSchema.lastName,
});

export const editPhone = Yup.object({
  homePhone: GenericSchema.phoneNum,
});
export const editPostalCode = Yup.object({
  postalCode: GenericSchema.postalCode,
});
export const editDateOfBirth = Yup.object({
  Dob: GenericSchema.Dob.optional(),
});

export const businessLocation = Yup.object({
  isBusinessLocation: Yup.boolean(),
  isClientLocation: Yup.boolean(),
});
export const businessAddress = Yup.object({
  address: GenericSchema.reqString,
  city: GenericSchema.reqString,
  district: GenericSchema.reqString,
});
export const addservice = Yup.object({
  isCustomService: Yup.boolean(),
  subCatogary: GenericSchema.string,
  serviceName: GenericSchema.string,
  customServiceName: Yup.string().when("isCustomService", (isCustomService) => {
    if (isCustomService[0]) {
      return GenericSchema.requiredString("");
    }
    return GenericSchema.string;
  }),
  servicePrice: GenericSchema.maxRequiredString("Service price"),
  serviceDuration: Yup.number(),
});
export const createEmployee = Yup.object({
  firstName: GenericSchema.firstName,
  lastName: GenericSchema.lastName,
  email: GenericSchema.email,
});
export const businessCover = Yup.object({
  cover: GenericSchema.string,
});

// export const eligibilityCriteria = Yup.object({
//   Dob: GenericSchema.Dob,
//   statusInCanada: GenericSchema.statusInCanada,
//   gender: GenericSchema.gender,
//   arrivalDate: GenericSchema.arrivalDate,
//   benchmark_listening: GenericSchema.benchmark_listening,
//   hasWorkPermit: GenericSchema.hasWorkPermit,
//   someFinanceITExperienceOrTraining:
//     GenericSchema.someFinanceITExperienceOrTraining,
//   benchmark_reading: GenericSchema.benchmark_reading,
//   benchmark_writing: GenericSchema.benchmark_writing,
//   benchmark_speaking: GenericSchema.benchmark_speaking,
// });

export const generateSchema = (responsedata: {
  date_of_birth?: any;
  status_in_canada_id?: any;
  gender_id?: any;
  years_in_canada?: any;
  benchmark_listening?: any;
  has_work_permit?: any;
  some_finance_it_experience_or_training?: any;
  benchmark_reading?: any;
  benchmark_writing?: any;
  benchmark_speaking?: any;
  employment_status_id?: any;
  designated_groups_ids?: any;
  source_of_income_id?: any;
  state_id?: any;
  education_outside_of_canada_id?: any;
  education_status_id?: any;
  first_language_id?: any;
  understands_english_id?: any;
  highest_education_level_id?: any;
}) => {
  return Yup.object().shape({
    Dob: responsedata.date_of_birth
      ? GenericSchema.Dob.required("Date of Birth is required")
      : GenericSchema.Dob,
    statusInCanada: responsedata.status_in_canada_id
      ? GenericSchema.statusInCanada.required("Status in Canada is required")
      : GenericSchema.statusInCanada,
    gender: responsedata.gender_id
      ? GenericSchema.gender.required("Gender is required")
      : GenericSchema.gender,
    arrivalDate: responsedata.years_in_canada
      ? GenericSchema.arrivalDate.required("Arrival Date is required")
      : GenericSchema.arrivalDate,
    benchmark_listening: responsedata.benchmark_listening
      ? GenericSchema.benchmark_listening.required("required")
      : GenericSchema.benchmark_listening,
    hasWorkPermit: responsedata.has_work_permit
      ? GenericSchema.hasWorkPermit.required("Work Permit status is required")
      : GenericSchema.hasWorkPermit,
    someFinanceITExperienceOrTraining:
      responsedata.some_finance_it_experience_or_training
        ? GenericSchema.someFinanceITExperienceOrTraining.required(
            "Finance/IT experience is required"
          )
        : GenericSchema.someFinanceITExperienceOrTraining,
    benchmark_reading: responsedata.benchmark_reading
      ? GenericSchema.benchmark_reading.required("required")
      : GenericSchema.benchmark_reading,
    benchmark_writing: responsedata.benchmark_writing
      ? GenericSchema.benchmark_writing.required("required")
      : GenericSchema.benchmark_writing,
    benchmark_speaking: responsedata.benchmark_speaking
      ? GenericSchema.benchmark_speaking.required("required")
      : GenericSchema.benchmark_speaking,

    employmentStatus: responsedata.employment_status_id
      ? GenericSchema.EmploymentStatus.required("Employment Status is required")
      : GenericSchema.EmploymentStatus,

    DesignatedGroup: responsedata.designated_groups_ids
      ? GenericSchema.DesignatedGroup.required(
          "Designated Group Field is required"
        )
      : GenericSchema.DesignatedGroup,

    sourceOfIncomeId: responsedata.source_of_income_id
      ? GenericSchema.sourceOfIncomeId.required(
          "Source of Income Field is required"
        )
      : GenericSchema.sourceOfIncomeId,
    stateId: responsedata.state_id
      ? GenericSchema.state.required("Province Field is required")
      : GenericSchema.state,
    educationOutsideOfCanadaId: responsedata.education_outside_of_canada_id
      ? GenericSchema.educationOutside.required(
          "Education Outside Canada Field is required"
        )
      : GenericSchema.educationOutside,
    educationStatus: responsedata.education_status_id
      ? GenericSchema.educationStatus.required(
          "Education Status Field is required"
        )
      : GenericSchema.educationStatus,
    preferredLang: responsedata.first_language_id
      ? GenericSchema.preferredLang.required(
          "Preferred Language Field is required"
        )
      : GenericSchema.preferredLang,
    UnderstandEnglish: responsedata.understands_english_id
      ? GenericSchema.UnderstandEnglish.required(
          "Understand English Field is required"
        )
      : GenericSchema.UnderstandEnglish,
    highestEducation: responsedata.highest_education_level_id
      ? GenericSchema.highestEducation.required(
          "Highest Education Field is required"
        )
      : GenericSchema.highestEducation,
  });
};
