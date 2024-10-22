"use client";

import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { useUser } from "@/context/user";
import { useGeneralStore } from "../stores/generalStore";
import { AiFillHeart } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { IFullProduct } from "@/types";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { useUserStore } from "@/stores/userStore";

type Props = {
  product: IFullProduct;
  detailedProduct?: IFullProduct;
};

export default function LikeProductButton({ product }: Props) {
  const pathname = usePathname();
  const { user } = useUser();
  const { likes, setLikes } = useUserStore();
  const { setIsLoginOpen } = useGeneralStore();
  const [item, setItem] = useState<boolean>(likes.includes(product._id));
  const [count, setCounter] = useState(product.likes);

  useEffect(() => {
    setItem(likes.includes(product._id));
  }, [likes]);

  const likeMutation = useMutation({
    mutationKey: ["Like", product._id],
    mutationFn: () => axiosInstanceNew.post(`/api/user/likeProduct/${product._id}`),
    onSuccess: () => {
      setCounter(count + 1);
      setItem(true);
      setLikes();
    }
  });

  const unlikeMutation = useMutation({
    mutationKey: ["Unlike", product._id],
    mutationFn: () => axiosInstanceNew.post(`/api/user/unlikeProduct/${product._id}`),
    onSuccess: () => {
      setCounter(count - 1);
      setItem(false);
      setLikes();
    }
  });

  const handleLike = () => {
    if (!user || likeMutation.isPending || unlikeMutation.isPending) return;
    if (user && !user.isRegistered) return setIsLoginOpen(true);
    if (item) return unlikeMutation.mutate();
    likeMutation.mutate();
  };

  if (pathname.includes("product")) {
    return (
      <button className="px-2 text-center" onClick={handleLike}>
        <div className="cursor-pointer rounded-full bg-gray-200">
          {!likeMutation.isPending && !unlikeMutation.isPending ? (
            <AiFillHeart
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
    <button className="px-2 pb-4 text-center" onClick={handleLike}>
      <div className="cursor-pointer md:rounded-full md:bg-gray-200">
        {!likeMutation.isPending && !unlikeMutation.isPending ? (
          <AiFillHeart
            className={`p-0.5 transition-all md:p-2 ${item ? "fill-primary" : "fill-white md:fill-black"} text-white drop-shadow-md hover:fill-primary md:text-black md:filter-none`}
            size="40"
          />
        ) : (
          <BiLoaderCircle className="animate-spin p-2" size="40" />
        )}
      </div>
      <span className="text-sm font-semibold text-white md:text-gray-800">{count}</span>
    </button>
  );
}
