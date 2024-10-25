"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useGeneralStore } from "@/stores/generalStore";
import { BiMenu } from "react-icons/bi";
import { useUser } from "@/context/user";
import { useTranslation } from "@/context/Translation";
import BackArrow from "@/components/BackArrow";

type Props = {
  children: React.ReactNode;
  params: { id: string };
};

export default function ProfileLayout({ children, params }: Props) {
  const { setIsProfileMenuOpen } = useGeneralStore();
  const { t, lang } = useTranslation();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const titles: { [key: string]: string } = {
    "/profile/orders": t("profile.ordersHistory"),
    "/profile/me": t("profile"),
    "/profile/following": t("profile.following"),
    "/profile/changepassword": t("profile.changePassword"),
    "/profile/addresses": t("profile.addresses"),
    "/profile/cart": t("profile.cart"),
    "/profile/order-details": t("profile.orderDetails"),
    "/profile/reviews": t("profile.yourReviews")
  };

  let path = pathname.replace(`/${lang}`, "");
  path = params.id ? path.replace(params.id, "") : path;

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-20 w-full border bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">
            {pathname.includes("/profile/me")
              ? (user?.firstName ?? "Profile" + " " + user?.lastName ?? "")
              : pathname.includes("order-details")
                ? "Order Details"
                : titles[path]}
          </h1>
          {path === "/profile/me" ? (
            <button onClick={() => setIsProfileMenuOpen(true)}>
              <BiMenu size={25} />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>
      </div>
      <div className="md:mt-0">{children}</div>
    </>
  );
}
