"use client";

import React, { useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useGeneralStore } from "@/stores/generalStore";
import { IProductAttribute } from "@/types";
import { selectDefaultAttributes } from "@/lib/misc";
import ProductAttributes from "../ProductAttributes";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { useQuery } from "@tanstack/react-query";
import { BiLoaderCircle } from "react-icons/bi";

export default function AttributesOverlay() {
  const { setIsProductAttributesOpen, isAddToCartOpen, overlayProductId, action } = useGeneralStore();
  const [customAttributes, setCustomAttributes] = useState<IProductAttribute[]>([]);

  const productQuery = useQuery({
    queryKey: ["productAttributes", overlayProductId],
    queryFn: () =>
      axiosInstanceNew
        .get<{
          _id: string;
          productAttributes: IProductAttribute[];
          name: string;
        }>(`/api/product/attributes/${overlayProductId}`)
        .then((res) => {
          setCustomAttributes(selectDefaultAttributes(res.data.productAttributes));
          return res.data;
        }),
    enabled: isAddToCartOpen && !!overlayProductId
  });
  const product = productQuery.data;

  const handleAttributesChange = (attributeId: string, value: string[]) => {
    if (!product) return;
    let tempAttributes = [...customAttributes];
    const index = tempAttributes.findIndex((attr) => attr._id === attributeId);

    const originalAttribute = product.productAttributes.find((attr) => attr._id === attributeId) as IProductAttribute;
    const selectedValues = originalAttribute.values.filter((val) => value.includes(val._id)) as IProductAttribute[];

    tempAttributes[index] = { ...originalAttribute, values: selectedValues };

    setCustomAttributes(tempAttributes);
  };

  return (
    <OverlayLayout close={() => setIsProductAttributesOpen(false)} isOpen={isAddToCartOpen} title={product?.name}>
      {!productQuery.isFetching && product ? (
        <ProductAttributes
          customAttributes={customAttributes}
          handleChange={handleAttributesChange}
          productAttributes={product.productAttributes}
        />
      ) : null}
      {productQuery.isFetching ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={24} /> : null}
      <div className="px-6 py-4">
        <button
          className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-white"
          onClick={() => {
            action.fn && action.fn(customAttributes);
            setIsProductAttributesOpen(false);
          }}
        >
          {action.name}
        </button>
      </div>
    </OverlayLayout>
  );
}
