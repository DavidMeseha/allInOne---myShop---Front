"use server";
import { cookies } from "next/headers";
import axios from "./lib/axios";
import { redirect } from "next/navigation";
import { User } from "./types";

export async function setToken(token: string) {
  cookies().set("session", token, { httpOnly: true, sameSite: "strict", secure: true });
}

export async function removeToken() {
  cookies().delete("session");
}

export async function logout() {
  try {
    await axios.post(
      "/api/auth/logout",
      {},
      { headers: { Authorization: "Bearer " + cookies().get("session")?.value } }
    );
    await removeToken();
    const guest = await axios.get<{ user: User; token: string }>("/api/auth/guest");
    await setToken(guest.data.token);
  } catch {
    return redirect("/login");
  }
  return redirect("/");
}

export async function registerGuest() {
  try {
    const guest = await axios.get<{ user: User; token: string }>("/api/auth/guest");
    await setToken(guest.data.token);
  } catch {
    return redirect("/login");
  }
  return redirect("/");
}
