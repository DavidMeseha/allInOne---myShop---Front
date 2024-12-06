import { setToken } from "@/actions";
import { useTranslation } from "@/context/Translation";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";

export default function UserSetupWrapper({ children }: { children: React.ReactNode }) {
  const { setUserActions, setUser } = useUserStore();
  const { user } = useUserStore();
  const { t } = useTranslation();

  const resetAxiosIterceptor = (token: string) => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  };

  useQuery({
    queryKey: ["checkToken"],
    queryFn: () =>
      axios
        .get<User>("/api/auth/check")
        .then((res) => {
          setUser(res.data);
          setUserActions();
          return res.data;
        })
        .catch(() => {
          if (user?.isRegistered) toast.error(t("auth.forcedLogout"));
          guestTokenMutation.mutate();
        })
  });

  const guestTokenMutation = useMutation({
    mutationFn: () => axios.get<{ user: User; token: string }>("/api/auth/guest"),
    onSuccess: async (res) => {
      setUser(res.data.user);
      await setToken(res.data.token);
      resetAxiosIterceptor(res.data.token);
      setUserActions();
    }
  });

  useQuery({
    queryKey: ["refresh"],
    queryFn: () =>
      axios
        .get<{ token: string }>("/api/auth/refreshToken")
        .then((res) => {
          setToken(res.data.token);
          resetAxiosIterceptor(res.data.token);
          return null;
        })
        .catch(() => {
          guestTokenMutation.mutate();
          return null;
        }),

    enabled: !!user?.isRegistered,
    refetchInterval: 1_680_000
  });

  return children;
}
