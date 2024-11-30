import axios from "@/lib/axios";

let savesTimeoutId: number;
let likesTimeoutId: number;

export async function getLikeIds(): Promise<string[]> {
  return await new Promise((resolve) => {
    clearTimeout(likesTimeoutId);
    likesTimeoutId = window.setTimeout(async () => {
      try {
        const res = await axios.get<string[]>("/api/common/likesId");
        resolve(res.data);
      } catch {
        resolve([]);
      }
    }, 400);
  });
}

export async function getSaveIds(): Promise<string[]> {
  return await new Promise((resolve) => {
    clearTimeout(savesTimeoutId);
    savesTimeoutId = window.setTimeout(async () => {
      try {
        const res = await axios.get<string[]>("/api/common/savesId");
        resolve(res.data);
      } catch {
        resolve([]);
      }
    }, 400);
  });
}

export async function getFollowIds() {
  try {
    const res = await axios.get<string[]>("/api/common/followingIds");
    return res.data;
  } catch {
    return [];
  }
}

export async function getReviewIds() {
  try {
    const res = await axios.get<string[]>("/api/common/reviewedIds");
    return res.data;
  } catch {
    return [];
  }
}

export async function getUserActions() {
  try {
    const res = await axios.get<{
      reviews: string[];
      cart: { product: string; quantity: number }[];
      likes: string[];
      saves: string[];
      follows: string[];
    }>("/api/common/allActions");
    return res.data;
  } catch {
    return {
      reviews: [],
      cart: [],
      likes: [],
      saves: [],
      follows: []
    };
  }
}
