"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { parseCookies } from "@/lib/misc";
import { useGeneralStore } from "@/stores/generalStore";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/layout/MainLayout";
import { useTranslation } from "./Translation";
import { RegisterForm, User, FieldError } from "../types";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { useUserStore } from "@/stores/userStore";

interface UserContextTypes {
  user: User | null;
  profile: undefined;
  register: {
    errorMessage: FieldError;
    mutate: (form: RegisterForm) => Promise<void>;
    isPending: boolean;
    clearError: () => void;
  };
  login: {
    errorMessage: FieldError;
    mutate: (email: string, password: string) => void;
    isPending: boolean;
    clearError: () => void;
  };
  logout: () => void;
}

const UserContext = createContext<UserContextTypes>({
  user: null,
  profile: undefined,
  login: { errorMessage: false, mutate: () => Promise.resolve(), isPending: false, clearError: () => {} },
  logout: () => Promise.resolve(),
  register: { errorMessage: false, mutate: () => Promise.resolve(), isPending: false, clearError: () => {} }
});

type ContextProps = { children: ReactNode };

function UserProvider({ children }: ContextProps) {
  const { setLikes, setSavedProducts, setFollowedVendors, setReviewedProducts, setCartProducts } = useUserStore();
  const { setIsLoginOpen, setCountries } = useGeneralStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<FieldError>(false);
  const { t } = useTranslation();

  useEffect(() => {
    axiosInstanceNew.interceptors.request.use((config) => {
      const access_token = parseCookies(document.cookie)?.filter((cookie) => cookie.name === "access_token")[0]?.value;
      config.headers.Authorization = `Bearer ${access_token}`;
      return config;
    });

    axiosInstanceNew.interceptors.response.use(
      (res) => res,
      (err: AxiosError) => {
        if (err.status === 500) toast.error(t("serverFail"));
        if (err.status === 403) {
          queryClient.clear();
          queryClient.fetchQuery({ queryKey: ["tokenCheck"] });
        }
        return Promise.reject(err);
      }
    );

    setCountries();
    setIsLoading(false);
  }, []);

  const resetUserStore = () => {
    setLikes();
    setSavedProducts();
    setFollowedVendors();
    setReviewedProducts();
    setCartProducts();
  };

  useQuery({
    queryKey: ["tokenCheck"],
    queryFn: () =>
      axiosInstanceNew
        .get<User>("/api/auth/check")
        .then((res) => {
          setUser(res.data);
          resetUserStore();
          return res.data;
        })
        .catch((err: AxiosError) => {
          if (user?.isRegistered && err.response?.status === 400) {
            setUser(null);
            toast.error(t("auth.forcedLogout"));
            freshTokenMutation.mutate();
          } else if (err.response?.status === 400) {
            setUser(null);
            freshTokenMutation.mutate();
          }
        }),

    refetchInterval: 120000
  });

  const freshTokenMutation = useMutation({
    mutationKey: ["guestToken"],
    mutationFn: () => axiosInstanceNew.get<{ user: User; token: string }>("/api/auth/guest"),
    onSuccess: (res) => {
      document.cookie = `access_token=;path=/`;
      document.cookie = `access_token=${res.data.token};path=/`;
      setUser({ ...res.data.user });
      resetUserStore();
      setIsLoginOpen(false);
    }
  });

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (form: RegisterForm) =>
      axiosInstanceNew
        .post<{ token: User }>("/api/auth/register", { ...form, gender: !form.gender.length ? null : form.gender })
        .then((res) => res.data.token),

    onSuccess: () => {
      toast.success(t("auth.successfullRegister"));
    },
    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 400) setErrorMessage(err.response?.data.message ?? "");
    }
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (form: { email: string; password: string }) =>
      axiosInstanceNew.post<{ user: User; token: string }>("/api/auth/login", { ...form }).then((data) => data.data),

    onSuccess: (res) => {
      toast.success(t("auth.successfullLogin"));
      document.cookie = `access_token=;path=/`;
      document.cookie = `access_token=${res.token};path=/`;
      setUser({ ...res.user });
      resetUserStore();
      setIsLoginOpen(false);
    },

    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 401) setErrorMessage(err.response.data.message);
    }
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => axiosInstanceNew.post("/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      setUser(null);
      document.cookie = "access_token=;path=/";
      toast.warn(t("auth.successfullLogout"));
      freshTokenMutation.mutate();
    }
  });

  const login = (email: string = "", password: string = "") => {
    loginMutation.mutate({ email, password });
  };

  const register = async (form: RegisterForm) => {
    await registerMutation.mutateAsync({ ...form });
  };

  const loginObject = {
    errorMessage,
    mutate: login,
    isPending: loginMutation.isPending,
    clearError: () => setErrorMessage(false)
  };
  const registerObject = {
    errorMessage,
    mutate: register,
    isPending: registerMutation.isPending,
    clearError: () => setErrorMessage(false)
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile: undefined,
        login: loginObject,
        logout: logoutMutation.mutate,
        register: registerObject
      }}
    >
      {!isLoading ? children : null}
    </UserContext.Provider>
  );
}

export default UserProvider;

export const useUser = () => useContext(UserContext);
