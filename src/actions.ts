"use server";

import { cookies } from "next/headers";

export const setAccessToken = async (token: string) => {
  cookies().set("access_token", token, { secure: true, sameSite: true });
};

export const removeToken = async () => {
  cookies().delete("access_token");
};
