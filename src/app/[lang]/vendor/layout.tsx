"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { BsFilter } from "react-icons/bs";
import { useGeneralStore } from "@/stores/generalStore";
import BackArrow from "@/components/BackArrow";
import { useTranslation } from "@/context/Translation";

type Props = { children: React.ReactNode };

export default function VendorLayout({ children }: Props) {
  const { setIsAdvancedSearchOpen } = useGeneralStore();
  const { t, lang } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const titleKey = pathname.replace(`/${lang}`, "");

  const titles: { [key: string]: string } = {
    "/vendor/products": t("vendor.yourProducts"),
    "/vendor/dashboard": t("vendor.dashboard"),
    "/vendor/shipments": t("vendor.shipments"),
    "/vendor/orders": t("vendor.orders"),
    "/vendor/reports/lowstock": t("vendor.lowStock"),
    "/vendor/reports/bestsellers": t("vendor.bestSellers"),
    "/vendor/reports/neverpurchased": t("vendor.productsNeverPurchased")
  };

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-30 w-full border-b border-b-lightGray bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold capitalize">{titles[titleKey] || "Profile"}</h1>
          {pathname === "/" + lang + "/vendor/products" ||
          pathname === "/" + lang + "/vendor/orders" ||
          pathname === "/" + lang + "/vendor/reports/neverpurchased" ||
          pathname === "/" + lang + "/vendor/reports/bestsellers" ||
          pathname === "/" + lang + "/vendor/reports/lowstock" ? (
            <button onClick={() => setIsAdvancedSearchOpen(true)}>
              <BsFilter className="fill-black" size={25} />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>
      </div>
      <div className="  md:mt-0">{children}</div>
    </>
  );
}
