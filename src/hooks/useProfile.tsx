import { useMutation } from "@apollo/client";

import {
  DELETE_USER,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
} from "@graphql";
import {
  Mutation,
  MutationDeleteUserArgs,
  MutationUpdateEmailArgs,
  MutationUpdatePasswordArgs,
  MutationUpdateProfileArgs,
} from "@utils";

export const useProfile = () => {
  const [updateProfile] = useMutation<Mutation, MutationUpdateProfileArgs>(
    UPDATE_PROFILE
  );
  const [updateEmail] = useMutation<Mutation, MutationUpdateEmailArgs>(
    UPDATE_EMAIL
  );
  const [deleteUser] = useMutation<Mutation, MutationDeleteUserArgs>(
    DELETE_USER
  );

  const [updatePassword] = useMutation<Mutation, MutationUpdatePasswordArgs>(
    UPDATE_PASSWORD
  );

  const UpdateProfile = async (variables: MutationUpdateProfileArgs) => {
    try {
      const res = await updateProfile({ variables });
      return res;
    } catch (err) {
      throw err;
    }
  };
  const UpdateEmail = async (variables: MutationUpdateEmailArgs) => {
    try {
      const res = await updateEmail({ variables });
      return res;
    } catch (err) {
      throw err;
    }
  };
  const UpdatePassword = async (variables: MutationUpdatePasswordArgs) => {
    try {
      const res = await updatePassword({ variables });
      return res;
    } catch (err) {
      throw err;
    }
  };
  const DeleteUser = async (variables: MutationDeleteUserArgs) => {
    try {
      const res = await deleteUser({ variables });
      return res;
    } catch (err) {
      throw err;
    }
  };

  return { UpdateProfile, UpdateEmail, DeleteUser, UpdatePassword };
};
