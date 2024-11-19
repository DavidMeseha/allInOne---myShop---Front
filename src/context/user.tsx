"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useGeneralStore } from "@/stores/generalStore";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/components/layout/MainLayout";
import { useTranslation } from "./Translation";
import { User } from "../types";
import { useUserStore } from "@/stores/userStore";
import { logout, registerGuest } from "@/actions";

interface UserContextTypes {
  user: User | null;
  logout: () => void;
}

const UserContext = createContext<UserContextTypes>({
  user: null,
  logout: () => Promise.resolve()
});

type ContextProps = { children: ReactNode; user: User | null };

function UserProvider({ children, user }: ContextProps) {
  const { setLikes, setSavedProducts, setFollowedVendors, setReviewedProducts, setCartProducts } = useUserStore();
  const { setCountries } = useGeneralStore();
  const [data, setData] = useState<User | null>(user);
  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      if (user === null) return await registerGuest();
      resetUserStore();
      setCountries();
      setData(user);
    };

    init();
  }, [user]);

  const resetUserStore = () => {
    setLikes();
    setSavedProducts();
    setFollowedVendors();
    setReviewedProducts();
    setCartProducts();
  };

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.clear();
      toast.warn(t("auth.successfullLogout"));
    }
  });

  return (
    <UserContext.Provider
      value={{
        user: data,
        logout: logoutMutation.mutate
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;

export const useUser = () => useContext(UserContext);
