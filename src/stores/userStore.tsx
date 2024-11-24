import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { getAllUserActions, getCartIds, getFollowIds, getLikeIds, getReviewIds, getSaveIds } from "@/actions";
import { User } from "@/types";

export interface UserStore {
  user: User | null;
  reviews: string[];
  cartItems: { product: string; quantity: number }[];
  saves: string[];
  following: string[];
  likes: string[];
  setLikes: (likes?: string[]) => Promise<void>;
  setCartItems: (cartItems?: { product: string; quantity: number }[]) => Promise<void>;
  setSaves: (saves?: string[]) => Promise<void>;
  setFollowedVendors: (followed?: string[]) => Promise<void>;
  setReviews: (reviews?: string[]) => Promise<void>;
  setUser: (user: User) => void;
  setUserActions: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        reviews: [],
        cartItems: [],
        saves: [],
        likes: [],
        following: [],

        setReviews: async (reviews?: string[]) => {
          const result = reviews ?? (await getReviewIds());
          set({ reviews: result });
        },
        setLikes: async (likes?: string[]) => {
          const result = likes ?? (await getLikeIds());
          set({ likes: result });
        },
        setCartItems: async (cartItems?: { product: string; quantity: number }[]) => {
          const result = cartItems ?? (await getCartIds());
          set({ cartItems: result });
        },
        setSaves: async (saves?: string[]) => {
          const result = saves ?? (await getSaveIds());
          set({ saves: result });
        },
        setFollowedVendors: async (followed?: string[]) => {
          const result = followed ?? (await getFollowIds());
          set({ following: result });
        },
        setUser: (user: User) => set({ user: user }),
        setUserActions: async () => {
          const result = await getAllUserActions();
          set({
            reviews: result.reviews,
            likes: result.likes,
            following: result.follows,
            cartItems: result.cart,
            saves: result.saves
          });
        }
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);
