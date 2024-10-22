import Link from "next/link";
import React from "react";
import SubMenuItem from "./SubMenuItem";
import { RiMessageFill, RiMessageLine, RiProfileFill, RiProfileLine } from "react-icons/ri";
import { BsCompass, BsCompassFill, BsHouse, BsHouseFill } from "react-icons/bs";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";

export default function MainMenu() {
  const { t, lang } = useTranslation();
  const { cartProducts } = useUserStore();

  const menu = [
    {
      name: t("home"),
      to: `/${lang}`,
      icon: <BsHouse className="mx-auto" size={25} />,
      iconActive: <BsHouseFill className="mx-auto" size={25} />
    },
    {
      name: t("profile"),
      to: `/${lang}/profile/me`,
      icon: <RiProfileLine className="mx-auto" size={25} />,
      iconActive: <RiProfileFill className="mx-auto" size={25} />
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
      icon: <BsCompass className="mx-auto" size={25} />,
      iconActive: <BsCompassFill className="mx-auto" size={25} />
    },
    {
      name: "Cart" + ` (${cartProducts.length})`,
      to: `/${lang}/cart`,
      icon: <RiMessageLine className="mx-auto" size={25} />,
      iconActive: <RiMessageFill className="mx-auto" size={25} />
    }
  ];

  return (
    <ul>
      {menu.map((item, index) => (
        <li key={index}>
          {item.to ? (
            <Link className="block w-full rounded-md p-2 text-lg font-semibold hover:bg-lightGray" href={item.to}>
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
