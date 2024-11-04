import getCountries from "@/hooks/getCountries";
import { IFullProduct, IProductAttribute } from "@/types";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

interface GeneralStore {
  isLoginOpen: boolean;
  isEditProfileOpen: boolean;
  isShareOpen: boolean;
  isProfileMenuOpen: boolean;
  isAddToCartOpen: boolean;
  isProductMoreInfoOpen: boolean;
  isHomeMenuOpen: boolean;
  isSearchOpen: boolean;
  isAdvancedSearchOpen: boolean;
  isAddReviewOpen: boolean;
  isAddAddressOpen: boolean;
  shareUrl: string;
  overlayProduct: IFullProduct | null;
  overlayProductId: string | null;
  search: string;
  countries: { name: string; _id: string; code: string }[];
  action: { name: string | null; fn: ((attr: IProductAttribute[]) => void) | null };
  shareAction: () => void;

  //Overlays setState
  setIsProductMoreInfoOpen: (val: boolean, productId?: string) => void;
  setIsLoginOpen: (val: boolean) => void;
  setIsEditProfileOpen: (val: boolean) => void;
  setIsProfileMenuOpen: (val: boolean) => void;
  setIsHomeMenuOpen: (val: boolean) => void;
  setIsAdvancedSearchOpen: (val: boolean) => void;
  setIsAddAddressOpen: (val: boolean) => void;
  setIsProductAttributesOpen: (
    val: boolean,
    productId?: string,
    actionName?: string,
    action?: (atrr: IProductAttribute[]) => void
  ) => void;
  setIsSearchOpen: (val: boolean) => void;

  //data setState
  setShare: (val: boolean, action?: () => void, url?: string) => void;
  setSearch: (val: string) => void;
  setIsAddReviewOpen: (val: boolean, productId?: string) => void;
  setCountries: () => void;
}

export const useGeneralStore = create<GeneralStore>()(
  devtools(
    persist(
      (set) => ({
        //overlay states
        isLoginOpen: false,
        isEditProfileOpen: false,
        isShareOpen: false,
        isAddToCartOpen: false,
        isProfileMenuOpen: false,
        isProductMoreInfoOpen: false,
        isHomeMenuOpen: false,
        isSearchOpen: false,
        isAdvancedSearchOpen: false,
        isAddReviewOpen: false,
        isAddAddressOpen: false,

        //overlay data
        shareUrl: "",
        search: "",
        overlayProduct: null,
        overlayProductId: null,
        action: { name: null, fn: null },
        countries: [],
        shareAction: () => {},

        //overlay toggles
        setIsHomeMenuOpen: (val: boolean) => set({ isHomeMenuOpen: val }),
        setIsLoginOpen: (val: boolean) => set({ isLoginOpen: val }),
        setIsAddAddressOpen: (val: boolean) => set({ isAddAddressOpen: val }),
        setIsEditProfileOpen: (val: boolean) => set({ isEditProfileOpen: val }),
        setIsProfileMenuOpen: (val: boolean) => set({ isProfileMenuOpen: val }),
        setIsAdvancedSearchOpen: (val: boolean) => set({ isAdvancedSearchOpen: val }),
        setIsSearchOpen: (val: boolean) => set({ isSearchOpen: val }),
        setSearch: (val: string) => set({ search: val }),
        setIsProductMoreInfoOpen: (val: boolean, productId?: string) =>
          set((prev) => ({ isProductMoreInfoOpen: val, overlayProductId: productId ?? prev.overlayProductId })),
        setShare: (val: boolean, shareAction: () => void = () => {}, url: string = "") =>
          set({ isShareOpen: val, shareUrl: window.location.origin + url, shareAction }),
        setIsAddReviewOpen: (val: boolean, productId?: string) =>
          set((prev) => ({ isAddReviewOpen: val, overlayProductId: productId ?? prev.overlayProductId })),
        setCountries: async () => set({ countries: await getCountries() }),
        setIsProductAttributesOpen: (
          val: boolean,
          productId?: string,
          actionName?: string,
          action?: (attr: IProductAttribute[]) => void
        ) =>
          set((prev) => ({
            isAddToCartOpen: val,
            overlayProductId: productId ?? prev.overlayProductId,
            action: { name: actionName ?? null, fn: action ?? null }
          }))
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);
