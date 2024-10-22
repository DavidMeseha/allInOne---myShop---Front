"use client";

import React, { useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { ShoppingCartProduct } from "../types";
import { Product } from "../types";
import ClickRecognition from "@/hooks/useClickRecognition";
import { useUserStore } from "@/stores/userStore";
import useAddProductToCarts from "@/hooks/useAddProductToCarts";
import useRemoveFromCarts from "@/hooks/useRemoveFromCarts";
import { useUser } from "@/context/user";
import { useGeneralStore } from "@/stores/generalStore";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";

type Props = {
  product: Product;
};

export default function ProductItem({ product }: Props) {
  const { user } = useUser();
  const { shoppingCartProducts, setCartProducts } = useUserStore();
  const { setShare, setIsProductAttributesOpen } = useGeneralStore();
  const { lang, t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [cartItem, setCartItem] = useState<ShoppingCartProduct | null>();
  const menuRef = useRef(null);

  // Add & remove for carts mutations
  const addToCartsMutation = useAddProductToCarts({
    onSuccess: (data) => {
      setCartProducts();
      setCartItem(data.find((pro) => product.id === pro.product_id));
    },
    cartType: "cart"
  });
  const removeFromCartMutation = useRemoveFromCarts({
    onSuccess: () => {
      setCartProducts();
      setCartItem(null);
    }
  });

  useEffect(() => {
    setCartItem(shoppingCartProducts.find((pro) => pro.product_id === product.id));
  }, []);

  const addToCart = () => {
    if (!user) return;
    if (addToCartsMutation.isPending || removeFromCartMutation.isPending) return;
    if (cartItem) {
      removeFromCartMutation.mutate(cartItem.id);
    } else {
      if (product.attributes.length)
        return setIsProductAttributesOpen(true, product, "add to cart", () =>
          addToCartsMutation.mutate({ productId: product.id })
        );
      addToCartsMutation.mutate({ productId: product.id });
    }
  };

  ClickRecognition(() => setShowMenu(false), menuRef);

  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={product.name}
          className="h-14 w-14 rounded-full bg-lightGray object-contain"
          height={66}
          src={product.images.length ? product.images[0].src : "/images/placeholder-user.jpg"}
          width={66}
        />
        <div>
          <p className="font-bold">{product.name}</p>
          <p className="text-strongGray">{product.price}$</p>
        </div>
      </div>
      <div className="relative" ref={menuRef}>
        <button onClick={() => setShowMenu(!showMenu)}>
          <BiDotsVerticalRounded size={25} />
        </button>
        {showMenu && (
          <div className="absolute end-0 z-30 w-44 rounded-md border bg-white">
            <ul className="text-sm">
              <li>
                <button className="border-b-[1px] px-4 py-2" onClick={addToCart}>
                  {!addToCartsMutation.isPending && !removeFromCartMutation.isPending ? (
                    cartItem ? (
                      t("removeFromCart")
                    ) : (
                      t("addToCart")
                    )
                  ) : (
                    <div className="text-strongGray">Updating....</div>
                  )}
                </button>
              </li>
              <li className="border-b-[1px] px-4 py-2">Save</li>
              <li className="border-b-[1px] px-4 py-2">Like</li>
              <li>
                <button
                  className="px-4 py-2"
                  onClick={() => setShare(true, () => {}, `/${lang}/product/${product.id}`)}
                >
                  Share
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
