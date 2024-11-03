"use client";

import React, { useState } from "react";
import { IFullProduct } from "../types";
import { BiLoaderCircle } from "react-icons/bi";
import { useUser } from "../context/user";
import { useGeneralStore } from "../stores/generalStore";
import { usePathname } from "next/navigation";
import { BsStarFill } from "react-icons/bs";
import { useUserStore } from "@/stores/userStore";

type Props = {
  product: IFullProduct;
};

export default function RateProductButton({ product }: Props) {
  const pathname = usePathname();
  const { user } = useUser();
  const { reviewedProducts } = useUserStore();
  const { setIsAddReviewOpen, setIsLoginOpen } = useGeneralStore();
  const [isLoading] = useState(false);
  const isReviewed = reviewedProducts.includes(product._id);

  const handleAddreviewClick = () => {
    if (!user) return;
    if (!user.isRegistered) return setIsLoginOpen(true);
    if (!isReviewed) setIsAddReviewOpen(true, product._id);
  };

  if (pathname.includes("/product")) {
    return (
      <button className="px-2 text-center" onClick={handleAddreviewClick}>
        <button className={"rounded-full bg-gray-200 " + (isReviewed ? "cursor-default" : "")}>
          {!isLoading ? (
            <BsStarFill
              className={`p-2 transition-all ${isReviewed ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
              size="45"
            />
          ) : (
            <BiLoaderCircle className="animate-spin p-2" size="45" />
          )}
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews || 0}
        </span>
      </button>
    );
  }

  return (
    <button className="px-2 pb-4 text-center" onClick={handleAddreviewClick}>
      <div className={"md:rounded-full md:bg-gray-200 " + (isReviewed ? "cursor-default" : "")}>
        {!isLoading ? (
          <BsStarFill
            className={`p-0.5 transition-all md:p-2.5 ${isReviewed ? "fill-primary" : "fill-white md:fill-black"} text-white drop-shadow-md hover:fill-primary md:text-black md:filter-none`}
            size="40"
          />
        ) : (
          <BiLoaderCircle className="animate-spin p-2.5" size="40" />
        )}
      </div>
      <span className="text-sm font-semibold text-white md:text-gray-800">
        {product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews || 0}
      </span>
    </button>
  );
}
