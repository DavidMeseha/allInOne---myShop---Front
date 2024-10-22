import Link from "next/link";
import React from "react";
import SubMenuItem from "./SubMenuItem";
import { useTranslation } from "@/context/Translation";

export default function VendorMenu() {
  const { t, lang } = useTranslation();
  const menu = [
    {
      name: t("menu.dashboard"),
      to: `/${lang}/vendor/dashboard`
    },
    {
      name: t("menu.yourProducts"),
      to: `/${lang}/vendor/products`
    },
    {
      name: t("menu.orders"),
      to: `/${lang}/vendor/orders`
    },
    {
      name: t("menu.shipments"),
      to: `/${lang}/vendor/shipments`
    },
    {
      name: t("menu.reports"),
      sup: [
        {
          name: t("menu.lowStock"),
          to: `/${lang}/vendor/reports/lowstock`
        },
        {
          name: t("menu.bestsellers"),
          to: `/${lang}/vendor/reports/bestsellers`
        },
        {
          name: t("menu.productsNeverPurchased"),
          to: `/${lang}/vendor/reports/neverpurchased`
        }
      ]
    }
  ];

  return (
    <>
      <ul className="capitalize">
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
    </>
  );
}
