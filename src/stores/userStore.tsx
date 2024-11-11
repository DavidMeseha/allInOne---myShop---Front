import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import getCartItems from "../hooks/getCartItems";
import getLikeIds from "@/hooks/getLikesId";
import getSavesId from "@/hooks/getSavesId";
import getFollowingIds from "@/hooks/getFollowingIds";
import getReviewedIds from "@/hooks/getReviewIds";

export interface UserStore {
  reviewedProducts: string[];
  cartProducts: { product: string; quantity: number }[];
  savedProducts: string[];
  following: string[];
  likes: string[];
  setLikes: () => void;
  setCartProducts: () => void;
  setSavedProducts: () => void;
  setFollowedVendors: () => void;
  setReviewedProducts: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        reviewedProducts: [],
        cartProducts: [],
        savedProducts: [],
        likes: [],
        following: [],

        setReviewedProducts: async () => {
          const result = await getReviewedIds();
          set({ reviewedProducts: result });
        },
        setLikes: async () => {
          const result = await getLikeIds();
          set({ likes: result });
        },
        setCartProducts: async () => {
          const result = await getCartItems();
          set({ cartProducts: result });
        },
        setSavedProducts: async () => {
          const result = await getSavesId();
          set({ savedProducts: result });
        },
        setFollowedVendors: async () => {
          const result = await getFollowingIds();
          set({ following: result });
        }
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);
