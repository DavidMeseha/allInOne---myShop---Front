"use client";

import BackArrow from "@/components/BackArrow";
import { useTranslation } from "@/context/Translation";
import { useGeneralStore } from "@/stores/generalStore";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { BsSearch } from "react-icons/bs";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsSearchOpen } = useGeneralStore();
  const { t } = useTranslation();

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-50 w-full bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">{t("discover")}</h1>
          <button onClick={() => setIsSearchOpen(true)}>
            <BsSearch size={20} />
          </button>
        </div>
        <ul className="sticky top-11 z-50 flex w-full cursor-pointer items-center border-b bg-white">
          <li
            className={`w-full ${pathname.split("/")[pathname.split("/").length - 1] === "vendors" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
          >
            <Link className="flex justify-center py-2" href="vendors">
              {t("discover.vendors")}
            </Link>
          </li>
          <li
            className={`w-full ${pathname.split("/")[pathname.split("/").length - 1] === "categories" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
          >
            <Link className="flex justify-center py-2" href="categories">
              {t("discover.categories")}
            </Link>
          </li>
          <li
            className={`w-full ${pathname.split("/")[pathname.split("/").length - 1] === "tags" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
          >
            <Link className="flex justify-center py-2" href="tags">
              {t("discover.tags")}
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </>
  );
}
