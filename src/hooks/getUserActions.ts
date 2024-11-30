import axios from "@/lib/axios";
import { GenericAbortSignal } from "axios";

export async function getLikeIds(signal?: GenericAbortSignal) {
  try {
    const res = await axios.get<string[]>("/api/common/likesId", { signal });
    return res.data;
  } catch {
    return [];
  }
}

export async function getSaveIds(signal?: GenericAbortSignal) {
  try {
    const res = await axios.get<string[]>("/api/common/savesId", { signal });
    return res.data;
  } catch {
    return [];
  }
}

export async function getFollowIds(signal?: GenericAbortSignal) {
  try {
    const res = await axios.get<string[]>("/api/common/followingIds", { signal });
    return res.data;
  } catch {
    return [];
  }
}

export async function getReviewIds(signal?: GenericAbortSignal) {
  try {
    const res = await axios.get<string[]>("/api/common/reviewedIds", { signal });
    return res.data;
  } catch {
    return [];
  }
}

export async function getUserActions(signal?: GenericAbortSignal) {
  try {
    const res = await axios.get<{
      reviews: string[];
      cart: { product: string; quantity: number }[];
      likes: string[];
      saves: string[];
      follows: string[];
    }>("/api/common/allActions", { signal });
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
