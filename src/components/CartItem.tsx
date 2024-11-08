"use client";

import React, { useRef, useState } from "react";
import useClickRecognition from "@/hooks/useClickRecognition";
import { useUserStore } from "@/stores/userStore";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BiLoaderCircle } from "react-icons/bi";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import { IFullProduct, IProductAttribute } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import ProductAttributes from "./ProductAttributes";
import { queryClient } from "./layout/MainLayout";

type Props = {
  product: IFullProduct;
  canEdit?: boolean;
  attributes: IProductAttribute[];
  quantity: number;
};

export default function CartItem({ product, attributes, quantity, canEdit = false }: Props) {
  const { setCartProducts } = useUserStore();
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product._id],
    mutationFn: () => axios.delete(`/api/common/cart/remove/${product._id}`),
    onSuccess: () => {
      setCartProducts();
      queryClient.fetchQuery({ queryKey: ["cartProducts"] });
    }
  });

  useClickRecognition(() => setShowDetails(false), containerRef);

  return (
    <li className="list-none border-b px-4" ref={containerRef}>
      <div className="flex items-center justify-between py-2" onClick={() => setShowDetails(!showDetails)}>
        <div className="flex w-full items-center gap-3">
          <Image
            alt={product.name}
            className="h-14 w-14 rounded-md bg-lightGray"
            height={66}
            src={product.pictures[0].imageUrl}
            width={66}
          />
          <div>
            <p className="font-bold">{product.name}</p>
            <p className="text-sm text-strongGray">
              {product.price.price}$ . quantity: {quantity}
            </p>
          </div>
        </div>
        <div className="relative">
          {canEdit ? <RiArrowDropDownLine size={35} /> : <div>{quantity * product.price.price}$</div>}
        </div>
      </div>
      {canEdit ? (
        <div
          className={`px-1 transition-all ${showDetails ? "max-h-[300vh] overflow-auto" : "max-h-0 overflow-hidden"}`}
        >
          <ProductAttributes
            customAttributes={attributes}
            handleChange={() => {}}
            productAttributes={product.productAttributes}
          />

          <div className="mb-4 flex justify-end">
            <button className="rounded-md bg-lightGray px-4 py-2" onClick={() => removeFromCartMutation.mutate()}>
              {removeFromCartMutation.isPending ? (
                <BiLoaderCircle className="animate-spin" color="#000" size={25} />
              ) : (
                t("remove")
              )}
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}
