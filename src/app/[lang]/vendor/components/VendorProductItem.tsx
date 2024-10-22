"use client";

import { useGeneralStore } from "@/stores/generalStore";
import { Product } from "@/types";
import { useTranslation } from "@/context/Translation";
import ClickRecognition from "@/hooks/useClickRecognition";
import { ChangeEvent, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Image from "next/image";

type ProductItemProps = {
  product: Product;
  isSelected?: boolean;
  selectProduct?: (e: ChangeEvent<HTMLInputElement>) => void;
  canSelect?: boolean;
  isBestSellers?: boolean;
};

export default function VendorProductItem({
  product,
  isSelected,
  selectProduct,
  canSelect,
  isBestSellers
}: ProductItemProps) {
  const { setShare } = useGeneralStore();
  const [showMenu, setShowMenu] = useState(false);
  const { t } = useTranslation();
  const menuRef = useRef(null);

  ClickRecognition(() => setShowMenu(false), menuRef);
  return (
    <li className="px-4 py-2">
      <label className="flex items-center justify-between" htmlFor={product.id.toString()}>
        {canSelect && (
          <div className="pb-2 pe-2">
            <input
              checked={isSelected}
              className="me-2 border-red-300 bg-red-100 text-red-500 focus:ring-red-200"
              id={product.id.toString()}
              name="products"
              type="checkbox"
              onChange={selectProduct}
            />
          </div>
        )}
        <div className="flex w-full items-center gap-3">
          <Image
            alt={product.name}
            className="h-14 w-14 rounded-full bg-lightGray object-contain"
            height={66}
            src={product.images[0]?.src ?? "/images/placeholder-user.jpg"}
            width={66}
          />
          <div>
            <p className="font-bold">{product.name}</p>
            <p className="text-strongGray">
              {!isBestSellers ? (
                <>
                  {product.sku}, {product.price}$
                </>
              ) : (
                <>
                  {t("vendor.qtySold")}: {5}, {t("total")}: 1500$
                </>
              )}
            </p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)}>
            <BiDotsVerticalRounded size={25} />
          </button>
          {showMenu && (
            <div className="absolute end-0 z-30 w-44 rounded-md border bg-white">
              <ul className="text-sm capitalize">
                <li className="cursor-pointer px-4 py-2 hover:bg-lightGray">{t("vendor.edit")}</li>
                <li className="cursor-pointer px-4 py-2 hover:bg-lightGray">
                  <button onClick={() => setShare(true, () => {}, `/product/${product.id}`)}>
                    {t("vendor.share")}
                  </button>
                </li>
                <li className="cursor-pointer px-4 py-2 text-primary hover:bg-lightGray">
                  {product.published ? t("vendor.unpublish") : t("vendor.publish")}
                </li>
                <li className="border-t-[1px] px-4 py-2">
                  {t("vendor.stock")}: {product.stock_quantity}
                </li>
              </ul>
            </div>
          )}
        </div>
      </label>
    </li>
  );
}
