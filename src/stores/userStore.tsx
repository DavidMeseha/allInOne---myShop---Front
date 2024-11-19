import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { getCartIds, getFollowIds, getLikeIds, getReviewIds, getSaveIds } from "@/actions";

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
          const result = await getReviewIds();
          set({ reviewedProducts: result });
        },
        setLikes: async () => {
          const result = await getLikeIds();
          set({ likes: result });
        },
        setCartProducts: async () => {
          const result = await getCartIds();
          set({ cartProducts: result });
        },
        setSavedProducts: async () => {
          const result = await getSaveIds();
          set({ savedProducts: result });
        },
        setFollowedVendors: async () => {
          const result = await getFollowIds();
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
