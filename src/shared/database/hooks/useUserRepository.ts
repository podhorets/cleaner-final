import { useCallback } from "react";

import { userRepository } from "../repositories/UserRepository";
import { User } from "../types";

export function useUserRepository() {
  const getUser = useCallback(async (): Promise<User | null> => {
    return userRepository.getUser();
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>): Promise<User> => {
      return userRepository.updateUser(updates);
    },
    []
  );

  const updateField = useCallback(
    async <K extends keyof User>(field: K, value: User[K]): Promise<User> => {
      return userRepository.updateField(field, value);
    },
    []
  );

  return {
    getUser,
    updateUser,
    updateField,
  };
}

