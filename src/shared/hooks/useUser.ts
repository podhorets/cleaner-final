import { useCallback, useEffect, useState } from "react";

import { userRepository } from "@/src/shared/database/repositories/UserRepository";
import { User } from "@/src/shared/database/types";
import { useUserStore } from "@/src/stores/useUserStore";

export function useUser() {
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const loadUser = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const dbUser = await userRepository.getUser();
      if (dbUser) {
        setUser(dbUser);
      }
      return dbUser;
    } catch (error) {
      console.error("Failed to load user:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const updateUser = useCallback(
    async (updates: Partial<User>): Promise<User> => {
      const updatedUser = await userRepository.updateUser(updates);
      setUser(updatedUser);
      return updatedUser;
    },
    [setUser]
  );

  const updateField = useCallback(
    async <K extends keyof User>(field: K, value: User[K]): Promise<User> => {
      const updatedUser = await userRepository.updateField(field, value);
      setUser(updatedUser);
      return updatedUser;
    },
    [setUser]
  );

  return {
    user,
    isLoading,
    loadUser,
    updateUser,
    updateField,
  };
}

