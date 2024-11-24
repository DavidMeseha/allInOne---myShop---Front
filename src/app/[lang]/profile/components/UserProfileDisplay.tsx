import { useTranslation } from "@/context/Translation";
import axios from "@/lib/axios";
import { useGeneralStore } from "@/stores/generalStore";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct, IProductAttribute, UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { UserActivity } from "./UserActivity";
import Image from "next/image";
import { FiSettings } from "react-icons/fi";
import { BsBookmark, BsCart, BsHeart } from "react-icons/bs";
import { BiLoaderCircle, BiPencil } from "react-icons/bi";
import { LocalLink } from "@/components/LocalizedNavigation";
import ProductCard from "@/components/ProductCard";

export default function UserProfileDisplay() {
  const { t } = useTranslation();
  const { following } = useUserStore();
  const { isEditProfileOpen, setIsEditProfileOpen, setIsProfileMenuOpen } = useGeneralStore();
  const { cartItems } = useUserStore();
  const [activeTap, setActiveTap] = useState<"cart" | "bookmark" | "likes">("cart");

  const cartItemsQuery = useQuery({
    queryKey: ["cartItems"],
    queryFn: () =>
      axios
        .get<{ product: IFullProduct; quantity: number; attributes: IProductAttribute[] }[]>("/api/common/cart")
        .then((res) => res.data),
    enabled: activeTap === "cart"
  });

  const savesQuery = useQuery({
    queryKey: ["saves"],
    queryFn: () => axios.get<IFullProduct[]>("/api/user/saves").then((res) => res.data),
    enabled: activeTap === "bookmark"
  });

  const likedProductsQuery = useQuery({
    queryKey: ["likedProducts"],
    queryFn: () => axios.get<IFullProduct[]>("/api/user/likedProducts").then((res) => res.data),
    enabled: activeTap === "likes"
  });

  const userInfoQuery = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => axios.get<UserProfile>("/api/user/info").then((res) => res.data)
  });

  const userInfo = userInfoQuery.data;
  const isFeatching = savesQuery.isFetching || likedProductsQuery.isFetching || cartItemsQuery.isFetching;

  const activities = [
    {
      name: t("profile.following"),
      value: following.length,
      to: `/profile/following`
    },
    {
      name: t("profile.orders"),
      value: userInfoQuery.data?.ordersCount ?? 0,
      to: `/profile/orders`
    }
  ];

  if (!userInfo) return;

  return (
    <div className="relative pt-4">
      <LocalLink
        className="absolute end-4 top-4 rounded-sm bg-primary px-4 py-2 text-xs text-white md:end-0 md:text-base"
        href="/checkout"
      >
        {t("checkout")} ({cartItems.length})
      </LocalLink>
      <div className="flex w-full flex-col items-center md:mt-0">
        <Image
          alt={userInfo.firstName + " " + userInfo.lastName}
          className="h-[120px] w-[120px] rounded-full object-cover"
          height={130}
          src={userInfo.imageUrl}
          width={130}
        />
        <p className="text-center text-[30px] font-bold">
          {userInfo.firstName + " " + userInfo.lastName}
          <span>
            <button
              className="ms-2 rounded-md bg-lightGray p-1 text-xs font-semibold"
              onClick={() => setIsProfileMenuOpen(true)}
            >
              <FiSettings size={16} />
            </button>
          </span>
          <span>
            <button
              className="ms-2 rounded-md bg-lightGray p-1 text-xs font-semibold md:inline-block"
              onClick={() => setIsEditProfileOpen(!isEditProfileOpen)}
            >
              <BiPencil size={16} />
            </button>
          </span>
        </p>
        <UserActivity activities={activities} />
      </div>

      <div className="relative">
        <ul className="sticky top-[45px] z-10 mt-2 flex w-full items-center border-b border-t-[1px] bg-white md:top-0">
          <li className={`w-full ${activeTap === "cart" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <a className="flex justify-center py-2" onClick={() => setActiveTap("cart")}>
              <BsCart size={20} />
            </a>
          </li>
          <li className={`w-full ${activeTap === "bookmark" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <a className="flex justify-center py-2" onClick={() => setActiveTap("bookmark")}>
              <BsBookmark size={20} />
            </a>
          </li>
          <li className={`w-full ${activeTap === "likes" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <a className="flex justify-center py-2" onClick={() => setActiveTap("likes")}>
              <BsHeart size={20} />
            </a>
          </li>
        </ul>

        {activeTap === "cart" &&
          (cartItemsQuery.data && cartItemsQuery.data.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {cartItemsQuery.data.map((item, index) => (
                <ProductCard key={index} product={item.product} />
              ))}
            </div>
          ) : (
            <div className="py-14 text-center text-strongGray">{t("profile.emptyCart")}</div>
          ))}

        {activeTap === "bookmark" &&
          (savesQuery.data ? (
            savesQuery.data.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {savesQuery.data.map((item, index) => (
                  <ProductCard key={index} product={item} />
                ))}
              </div>
            ) : (
              <div className="py-14 text-center text-strongGray">{t("profile.noSaves")}</div>
            )
          ) : null)}

        {activeTap === "likes" &&
          (likedProductsQuery.data ? (
            likedProductsQuery.data.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {likedProductsQuery.data.map((item, index) => (
                  <ProductCard key={index} product={item} />
                ))}
              </div>
            ) : (
              <div className="py-14 text-center text-strongGray">{t("profile.noSaves")}</div>
            )
          ) : null)}

        {isFeatching ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 text-primary">
            <BiLoaderCircle className="animate-spin" size={40} />
          </div>
        ) : null}

        <div className="pb-20" />
      </div>
    </div>
  );
}
