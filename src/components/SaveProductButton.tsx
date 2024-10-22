"use client";

import React, { useEffect, useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useUser } from "../context/user";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { useGeneralStore } from "@/stores/generalStore";

type Props = {
  product: IFullProduct;
};

export default function SaveProductButton({ product }: Props) {
  const pathname = usePathname();
  const { user } = useUser();
  const { setIsLoginOpen } = useGeneralStore();
  const { savedProducts, setSavedProducts } = useUserStore();
  const [item, setItem] = useState<boolean>(savedProducts.includes(product._id));
  const [count, setCounter] = useState(product.saves);

  const saveMutation = useMutation({
    mutationKey: ["save", product._id],
    mutationFn: () => axiosInstanceNew.post(`/api/user/saveProduct/${product._id}`),
    onSuccess: () => {
      setSavedProducts();
      setItem(true);
      setCounter(count + 1);
    }
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product._id],
    mutationFn: () => axiosInstanceNew.post(`/api/user/unsaveProduct/${product._id}`),
    onSuccess: () => {
      setSavedProducts();
      setItem(false);
      setCounter(count - 1);
    }
  });

  const handleSave = () => {
    if (!user || saveMutation.isPending || unsaveMutation.isPending) return;
    if (!user.isRegistered) setIsLoginOpen(true);
    if (!item) return saveMutation.mutate();
    unsaveMutation.mutate();
  };

  useEffect(() => {
    setItem(savedProducts.includes(product._id));
  }, [savedProducts]);

  if (pathname.includes("/product")) {
    return (
      <button className="px-2 text-center" onClick={handleSave}>
        <div className="cursor-pointer rounded-full bg-gray-200">
          {!saveMutation.isPending && !unsaveMutation.isPending ? (
            <BsBookmarkFill
              className={`p-2 transition-all ${item ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
              size="45"
            />
          ) : (
            <BiLoaderCircle className="animate-spin p-2" size="45" />
          )}
        </div>
        <span className="text-sm font-semibold text-gray-800">{count}</span>
      </button>
    );
  }

  return (
    <button className="px-2 pb-4 text-center" onClick={handleSave}>
      <div className="cursor-pointer md:rounded-full md:bg-gray-200">
        {!saveMutation.isPending && !unsaveMutation.isPending ? (
          <BsBookmarkFill
            className={`p-0.5 transition-all md:p-2.5 ${item ? "fill-primary" : "fill-white md:fill-black"} text-white drop-shadow-xl hover:fill-primary md:text-black md:filter-none`}
            size="40"
          />
        ) : (
          <BiLoaderCircle className="animate-spin md:p-2.5" size="40" />
        )}
      </div>
      <div className="text-sm font-semibold text-white md:text-gray-800">{count}</div>
    </button>
  );
}
