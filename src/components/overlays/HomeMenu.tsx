"use client";

import React from "react";
import VendorMenu from "../VendorMenu";
import { useGeneralStore } from "@/stores/generalStore";
import { RiCloseLine } from "react-icons/ri";
import { useUser } from "@/context/user";
import MainMenu from "../MainMenu";
import { useTranslation } from "@/context/Translation";

export default function HomeMenu() {
  const { isHomeMenuOpen, setIsHomeMenuOpen } = useGeneralStore();
  const { user } = useUser();
  const { t } = useTranslation();
  return (
    <div
      data-testid="main-menu"
      className={`fixed bottom-0 top-0 z-50 w-full bg-white transition-all duration-500 ease-in-out md:hidden ${isHomeMenuOpen ? "start-0" : "-start-full"}`}
    >
      <div className="relative p-4">
        <div className="mb-6 text-2xl font-bold md:hidden">{t("mainMenu")}</div>
        <div
          data-testid="close-main-menu"
          className="absolute end-2 top-2 cursor-pointer rounded-full bg-lightGray p-1"
          onClick={() => setIsHomeMenuOpen(false)}
        >
          <RiCloseLine size={25} />
        </div>
        <MainMenu />
        {user?.isVendor ? <VendorMenu /> : null}
      </div>
    </div>
  );
}
