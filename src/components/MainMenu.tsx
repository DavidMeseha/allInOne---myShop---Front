import Link from "next/link";
import React from "react";
import SubMenuItem from "./SubMenuItem";
import { RiProfileFill, RiProfileLine } from "react-icons/ri";
import { BsCompass, BsCompassFill, BsHouse, BsHouseFill } from "react-icons/bs";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { usePathname } from "next/navigation";
import { PiShoppingCart, PiShoppingCartFill } from "react-icons/pi";

export default function MainMenu() {
  const { t, lang } = useTranslation();
  const { cartProducts } = useUserStore();
  const pathname = usePathname();

  const menu = [
    {
      name: t("home"),
      to: `/${lang}`,
      Icon: <BsHouse size={20} />,
      IconActive: <BsHouseFill size={20} />
    },
    {
      name: t("profile"),
      to: `/${lang}/profile/me`,
      Icon: <RiProfileLine size={20} />,
      IconActive: <RiProfileFill size={20} />
    },
    {
      name: t("discover"),
      sup: [
        {
          name: t("categories"),
          to: `/${lang}/discover/categories`
        },
        {
          name: t("vendors"),
          to: `/${lang}/discover/vendors`
        },
        {
          name: t("tags"),
          to: `/${lang}/discover/tags`
        }
      ],
      Icon: <BsCompass size={20} />,
      IconActive: <BsCompassFill size={20} />
    },
    {
      name: t("cart") + ` (${cartProducts.length})`,
      to: `/${lang}/cart`,
      Icon: <PiShoppingCart size={20} />,
      IconActive: <PiShoppingCartFill size={20} />
    }
  ];

  return (
    <ul>
      {menu.map((item, index) => (
        <li key={index}>
          {item.to ? (
            <Link
              href={item.to}
              className={`mb-2 flex w-full items-center gap-2 rounded-md p-2 text-lg font-semibold hover:bg-lightGray ${
                pathname === item.to ? "bg-lightGray text-primary" : ""
              }`}
            >
              {pathname === item.to ? item.IconActive : item.Icon}
              {item.name}
            </Link>
          ) : (
            item.sup && <SubMenuItem item={item} />
          )}
        </li>
      ))}
    </ul>
  );
}
