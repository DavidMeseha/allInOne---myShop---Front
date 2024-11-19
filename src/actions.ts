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

export async function logout(pathname: string) {
  try {
    await axios.post(
      "/api/auth/logout",
      {},
      { headers: { Authorization: "Bearer " + cookies().get("session")?.value } }
    );
    const guest = await axios.get<{ user: User; token: string }>("/api/auth/guest");
    await removeToken();
    await setToken(guest.data.token);
  } catch {
    return redirect(pathname);
  }
  return redirect(pathname);
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

export async function getUserActions(pathname: string) {
  try {
    const res = await axios.get<{
      reviews: string[];
      cart: string[];
      likes: string[];
      saves: string[];
      follows: string[];
    }>("/api/common/allActions", {
      headers: { Authorization: "Bearer " + cookies().get("session")?.value }
    });

    return res.data;
  } catch {
    redirect(pathname + "?message=could not get user actions");
  }
}

export async function getCartIds() {
  try {
    const res = await axios.get<{ product: string; quantity: number }[]>("/api/common/cart/ids", {
      headers: { Authorization: "Bearer " + cookies().get("session")?.value }
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function getLikeIds() {
  try {
    const res = await axios.get<string[]>("/api/common/likesId", {
      headers: { Authorization: "Bearer " + cookies().get("session")?.value }
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function getSaveIds() {
  try {
    const res = await axios.get<string[]>("/api/common/savesId", {
      headers: { Authorization: "Bearer " + cookies().get("session")?.value }
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function getFollowIds() {
  try {
    const res = await axios.get<string[]>("/api/common/followingIds", {
      headers: { Authorization: "Bearer " + cookies().get("session")?.value }
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function getReviewIds() {
  try {
    const res = await axios.get<string[]>("/api/common/reviewedIds", {
      headers: { Authorization: "Bearer " + cookies().get("session")?.value }
    });
    return res.data;
  } catch {
    return [];
  }
}
