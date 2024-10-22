"use client";

import React, { useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useGeneralStore } from "@/stores/generalStore";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { useUser } from "@/context/user";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useTranslation } from "@/context/Translation";
import { FaLanguage, FaRegAddressBook } from "react-icons/fa";
import { BsCurrencyExchange, BsStar } from "react-icons/bs";
import { PiPassword } from "react-icons/pi";

export default function ProfileMenuOverlay() {
  const { setIsProfileMenuOpen } = useGeneralStore();
  const { logout } = useUser();
  const [activeTap, setActiveTap] = useState("main");
  const { t, changeLang, languages, lang } = useTranslation();

  const userMenuNav = [
    {
      name: t("profile.addresses"),
      to: `/${lang}/profile/addresses`,
      icon: <FaRegAddressBook size={20} />
    },
    {
      name: t("profile.myReviews"),
      to: `/${lang}/profile/reviews`,
      icon: <BsStar size={20} />
    },
    {
      name: t("profile.languages"),
      icon: <FaLanguage size={20} />
    },
    {
      name: t("profile.currency"),
      icon: <BsCurrencyExchange size={20} />
    },
    {
      name: t("profile.changePassword"),
      to: `/${lang}/profile/changepassword`,
      icon: <PiPassword size={20} />
    }
  ];

  return (
    <OverlayLayout close={() => setIsProfileMenuOpen(false)}>
      <>
        {activeTap === "main" && (
          <ul>
            {userMenuNav.map((item, index) => (
              <li key={index}>
                {item.to ? (
                  <Link className="flex items-center gap-4 py-2 font-semibold" href={item.to}>
                    {item.icon}
                    {item.name}
                  </Link>
                ) : (
                  <button
                    className="flex items-center gap-4 py-2 font-semibold"
                    onClick={() => setActiveTap(item.name)}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                )}
              </li>
            ))}
            <li>
              <button className="flex items-center gap-4 py-2 font-semibold" onClick={logout}>
                <FiLogOut size={20} />
                {t("logout")}
              </button>
            </li>
          </ul>
        )}
        {activeTap === t("profile.languages") && (
          <ul className="min-h-[200px]">
            {languages.map((language) => (
              <li key={language}>
                <button
                  className="flex items-center gap-4 py-2 font-semibold"
                  onClick={() => {
                    changeLang(language);
                  }}
                >
                  {lang === language &&
                    (document.dir === "ltr" ? <BiSolidRightArrow size={15} /> : <BiSolidLeftArrow size={15} />)}
                  {language}
                </button>
              </li>
            ))}
          </ul>
        )}
        {activeTap === t("profile.currency") && (
          <ul className="min-h-[200px]">
            <li>
              <button
                className="flex items-center gap-4 py-2 font-semibold"
                onClick={() => {
                  setActiveTap("main");
                }}
              >
                <BiSolidRightArrow size={15} />
                USD
              </button>
            </li>
            <li>
              <button
                className="flex items-center gap-4 py-2 font-semibold"
                onClick={() => {
                  setActiveTap("main");
                }}
              >
                <div className="w-4" />
                LE
              </button>
            </li>
          </ul>
        )}
      </>
    </OverlayLayout>
  );
}
