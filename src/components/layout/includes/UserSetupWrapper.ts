import { setToken } from "@/actions";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

export default function UserSetupWrapper({ children }: { children: React.ReactNode }) {
  const { setUserActions, setUser } = useUserStore();

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
          guestTokenMutation.mutate();
        })
  });

  const guestTokenMutation = useMutation({
    mutationFn: () => axios.get<{ user: User; token: string }>("/api/auth/guest"),
    onSuccess: async (res) => {
      setUser(res.data.user);
      await setToken(res.data.token);
      setUserActions();
    }
  });

  return children;
}
