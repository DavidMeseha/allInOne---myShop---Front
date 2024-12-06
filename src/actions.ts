"use server";

import { cookies } from "next/headers";
import axios from "./lib/axios";
import { redirect } from "next/navigation";
import { IVendor, Language, User } from "./types";
import { getPathnameLang, replacePathnameLang } from "./lib/misc";

const axiosConfig = async () => {
  return {
    headers: {
      Authorization: `Bearer ${(await cookies()).get("session")?.value}`,
      "Accept-Language": (await cookies()).get("lang")?.value
    }
  };
};

export async function setToken(token: string) {
  (await cookies()).set("session", token, { httpOnly: true, sameSite: "strict", secure: true });
}

export async function removeToken() {
  (await cookies()).delete("session");
}

export async function setLanguage(lang: Language) {
  (await cookies()).set("lang", lang);
}

export async function getLanguage() {
  return ((await cookies()).get("lang")?.value ?? "en") as Language;
}

export async function logout(pathname: string) {
  try {
    await axios.post("/api/auth/logout", {}, await axiosConfig());
    const guest = await axios.get<{ user: User; token: string }>("/api/auth/guest");
    await setToken(guest.data.token);
    (await cookies()).set("lang", "en");
  } catch {
    return redirect(pathname);
  }
  const redirectLink = replacePathnameLang("en", pathname);
  redirect(redirectLink + "?message=auth.successfullLogout");
}

export async function registerGuest(pathname: string) {
  try {
    const guest = await axios.get<{ user: User; token: string }>("/api/auth/guest");
    await setToken(guest.data.token);
  } catch {
    return redirect(pathname);
  }
  return redirect(pathname);
}

export async function getCartIds() {
  try {
    const res = await axios.get<{ product: string; quantity: number }[]>("/api/common/cart/ids", await axiosConfig());
    return res.data;
  } catch {
    return [];
  }
}

export async function changeLanguage(lang: Language, pathname: string) {
  const pathnameLang = getPathnameLang(pathname);
  const tempPath = pathname;
  const pathOnly = tempPath.replace("/" + pathnameLang, "");

  try {
    await axios.post(`/api/common/changeLanguage/${lang}`, {}, await axiosConfig());
    await setLanguage(lang);
  } catch {
    return redirect(pathname + "?error=couldNotChangeLanguage");
  }
  return redirect(`/${lang}${pathOnly}`);
}

export async function follow(vendorId: string, pathanme: string) {
  try {
    await axios.post(`/api/user/followVendor/${vendorId}`, {}, await axiosConfig());
    return { success: true };
  } catch {
    redirect(pathanme + "?error=faildToSubmitYourAction");
  }
}

export async function unfollow(vendorId: string, pathanme: string) {
  try {
    await axios.post(`/api/user/unfollowVendor/${vendorId}`, {}, await axiosConfig());
    return { success: true };
  } catch {
    return redirect(pathanme + "?error=faildToSubmitYourAction");
  }
}

export async function followings(pathanme: string) {
  try {
    const res = await axios.get<IVendor[]>("/api/user/followingVendors", await axiosConfig());
    return res.data;
  } catch {
    return redirect(pathanme + "?error=faildToSubmitYourAction");
  }
}
