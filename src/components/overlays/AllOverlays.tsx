"use client";

import React, { useEffect } from "react";
import { useGeneralStore } from "../../stores/generalStore";
import AuthOverlay from "./AuthOverlay";
import EditProfileOverlay from "./EditProfileOverlay";
import ShareOverlay from "./Share";
import ProfileMenuOverlay from "./ProfileMenu";
import { usePathname } from "next/navigation";
import AttributesOverlay from "./AttributesOverlay";
import ProductMoreInfoOverlay from "./ProductMoreInfo";
import Search from "./Search";
import AddReviewOverlay from "./AddReviewOverlay";
import AddNewAddress from "./AddNewAddress";

export default function AllOverlays() {
  const {
    isLoginOpen,
    isEditProfileOpen,
    isShareOpen,
    isProfileMenuOpen,
    isAddToCartOpen,
    isProductMoreInfoOpen,
    isSearchOpen,
    isAdvancedSearchOpen,
    isAddReviewOpen,
    isAddAddressOpen,
    setIsProductAttributesOpen,
    setIsEditProfileOpen,
    setIsSearchOpen,
    setSearch,
    setShare,
    setIsProfileMenuOpen,
    setIsProductMoreInfoOpen,
    setIsHomeMenuOpen,
    setIsAdvancedSearchOpen,
    setIsAddAddressOpen
  } = useGeneralStore();
  const pathname = usePathname();

  useEffect(() => {
    setIsEditProfileOpen(false);
    setShare(false);
    setIsProfileMenuOpen(false);
    setIsProductAttributesOpen(false);
    setIsProductMoreInfoOpen(false);
    setIsHomeMenuOpen(false);
    setIsSearchOpen(false);
    setIsAdvancedSearchOpen(false);
    setIsAddAddressOpen(false);
    setSearch("");
  }, [pathname]);

  useEffect(() => {
    if (
      isLoginOpen ||
      isEditProfileOpen ||
      isShareOpen ||
      isAddToCartOpen ||
      isProfileMenuOpen ||
      isProductMoreInfoOpen ||
      isAdvancedSearchOpen ||
      isAddReviewOpen ||
      isAddAddressOpen
    )
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [
    isLoginOpen,
    isEditProfileOpen,
    isShareOpen,
    isAddToCartOpen,
    isProfileMenuOpen,
    isProductMoreInfoOpen,
    isAdvancedSearchOpen,
    isAddReviewOpen,
    isAddAddressOpen
  ]);
  return (
    <>
      {isLoginOpen ? <AuthOverlay /> : null}
      {isEditProfileOpen ? <EditProfileOverlay /> : null}
      {isShareOpen ? <ShareOverlay /> : null}
      {isProfileMenuOpen ? <ProfileMenuOverlay /> : null}
      {isAddToCartOpen ? <AttributesOverlay /> : null}
      {isProductMoreInfoOpen ? <ProductMoreInfoOverlay /> : null}
      {isSearchOpen ? <Search /> : null}
      {isAddReviewOpen ? <AddReviewOverlay /> : null}
      {isAddAddressOpen ? <AddNewAddress /> : null}
    </>
  );
}
