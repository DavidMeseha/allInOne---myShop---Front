"use client";

import React, { useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useGeneralStore } from "@/stores/generalStore";
import { IProductAttribute } from "@/types";
import { selectDefaultAttributes } from "@/lib/misc";
import ProductAttributes from "../ProductAttributes";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Button from "../Button";

export default function AttributesOverlay() {
  const { setIsProductAttributesOpen, overlayProductId, action } = useGeneralStore();
  const [customAttributes, setCustomAttributes] = useState<IProductAttribute[]>([]);

  const productQuery = useQuery({
    queryKey: ["productAttributes", overlayProductId],
    queryFn: () =>
      axios
        .get<{
          _id: string;
          productAttributes: IProductAttribute[];
          name: string;
        }>(`/api/product/attributes/${overlayProductId}`)
        .then((res) => {
          setCustomAttributes(selectDefaultAttributes(res.data.productAttributes));
          return res.data;
        })
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
    <OverlayLayout close={() => setIsProductAttributesOpen(false)} title={product?.name}>
      {productQuery.isFetching ? (
        <SkeletonTheme baseColor="#d5d5d5" highlightColor="#ececec">
          <Skeleton className="mb-1" height={20} width={100} />
          <Skeleton className="mb-6" height={40} />
          <Skeleton className="mb-2" height={20} width={100} />
          <div className="mb-8 flex gap-6">
            <div className="flex items-center gap-2">
              <Skeleton circle height={24} width={24} />
              <Skeleton height={20} width={85} />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton circle height={24} width={24} />
              <Skeleton height={20} width={85} />
            </div>
          </div>
          <Skeleton className="mb-2" height={20} width={100} />
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Skeleton circle height={24} width={24} />
              <Skeleton height={20} width={85} />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton circle height={24} width={24} />
              <Skeleton height={20} width={85} />
            </div>
          </div>
          <Skeleton className="mt-6" height={40} />
        </SkeletonTheme>
      ) : product ? (
        <>
          <ProductAttributes
            customAttributes={customAttributes}
            handleChange={handleAttributesChange}
            productAttributes={product.productAttributes}
          />
          <Button
            className="mt-4 w-full bg-primary text-center text-white"
            onClick={() => {
              action.fn && action.fn(customAttributes);
              setIsProductAttributesOpen(false);
            }}
          >
            {action.name}
          </Button>
        </>
      ) : null}
    </OverlayLayout>
  );
}
