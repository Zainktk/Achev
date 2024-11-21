import { useMutation } from "@apollo/client";
import { LOGIN, RESET_PASSWORD, SEND_RESET_VERIFICATION_CODE } from "@graphql";
import {
  Mutation,
  MutationLoginArgs,
  MutationResetPasswordArgs,
  MutationSendResetVerificationCodeArgs,
} from "@utils";

export function useLogin() {
  const [login] = useMutation<Mutation, MutationLoginArgs>(LOGIN);
  const [sendResetVerificationCode] = useMutation<
    Mutation,
    MutationSendResetVerificationCodeArgs
  >(SEND_RESET_VERIFICATION_CODE);
  const [resetPassword] = useMutation<Mutation, MutationResetPasswordArgs>(
    RESET_PASSWORD
  );
  const LoginUser = async (variables: MutationLoginArgs) => {
    try {
      const res = await login({ variables });
      return res;
    } catch (Err) {
      throw Err;
    }
  };

  const SendResetCode = async (variables: { email: string }) => {
    try {
      const res = await sendResetVerificationCode({ variables });
      return res;
    } catch (Err) {
      throw Err;
    }
  };

  const ResetPassword = async (variables: MutationResetPasswordArgs) => {
    try {
      const res = await resetPassword({ variables });
      return res;
    } catch (Err) {
      throw Err;
    }
  };
  return { SendResetCode, ResetPassword, LoginUser };
}

export default useLogin;
