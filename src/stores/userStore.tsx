import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { getCartIds } from "@/actions";
import { User } from "@/types";
import { getFollowIds, getLikeIds, getReviewIds, getSaveIds, getUserActions } from "@/hooks/getUserActions";
import { GenericAbortSignal } from "axios";

export interface UserStore {
  user: User | null;
  reviews: string[];
  cartItems: { product: string; quantity: number }[];
  saves: string[];
  following: string[];
  likes: string[];
  setLikes: (likes?: string[]) => Promise<void>;
  setCartItems: (cartItems?: { product: string; quantity: number }[]) => Promise<void>;
  setSaves: (props?: { saves?: string[]; signal?: GenericAbortSignal }) => Promise<void>;
  setFollowedVendors: (followed?: string[]) => Promise<void>;
  setReviews: (reviews?: string[]) => Promise<void>;
  setUser: (user: User | null) => void;
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
        setSaves: async (props?: { saves?: string[]; }) => {
          const result = props?.saves ?? (await getSaveIds());
          set({ saves: result });
        },
        setFollowedVendors: async (followed?: string[]) => {
          const result = followed ?? (await getFollowIds());
          set({ following: result });
        },
        setUser: (user: User | null) => set({ user: user }),
        setUserActions: async () => {
          const result = await getUserActions();
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
