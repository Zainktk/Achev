import {
  Mutation,
  MutationSendVerificationCodeArgs,
  MutationUserSignupArgs,
  MutationVerifyArgs,
} from "@utils";

import { useMutation } from "@apollo/client";
import { SEND_VERIFICATION_CODE, USER_SIGNUP, VERIFY } from "@graphql";

export const useSignup = () => {
  const [sendVerificationCode] = useMutation<
    Mutation,
    MutationSendVerificationCodeArgs
  >(SEND_VERIFICATION_CODE);
  const [verify] = useMutation<Mutation, MutationVerifyArgs>(VERIFY);
  const [userSignup] = useMutation<Mutation, MutationUserSignupArgs>(
    USER_SIGNUP
  );
  const SendVerificationCode = async (
    variables: MutationSendVerificationCodeArgs
  ) => {
    try {
      const res = await sendVerificationCode({ variables });
      return res;
    } catch (err) {
      throw err;
    }
  };

  const Verifycode = async (variables: MutationVerifyArgs) => {
    try {
      const res = await verify({ variables });
      return res;
    } catch (err) {
      throw err;
    }
  };
  const UserSignUp = async (variables: MutationUserSignupArgs) => {
    try {
      const res = await userSignup({ variables });
      return res;
    } catch (err) {
      throw err;
    }
  };

  return { SendVerificationCode, Verifycode, UserSignUp };
};
