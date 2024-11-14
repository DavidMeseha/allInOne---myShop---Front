import "server-only";

import { User } from "./types";
import axios from "@/lib/axios";

const getToken = async () => {
  "use server";
  const guestUser = await axios
    .get<{ user: User; token: string }>("/api/auth/guest")
    .then((res) => res.data)
    .catch(() => null);

  return guestUser;
};

const check = async (token: string) => {
  "use server";
  const user = await axios
    .get<User>("/api/auth/check", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(async (res) => res.data)
    .catch(() => null);

  return user;
};

const getUser = async (token: string) => {
  "use server";
  const tokenUser = !token ? null : await check(token);

  let user: { user: User; token: string } | null = null;
  if (!tokenUser || !token) {
    user = await getToken();
  } else {
    user = { user: tokenUser, token: token };
  }

  return user;
};

export default getUser;
