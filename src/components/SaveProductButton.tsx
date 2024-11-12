"use client";

import { BsBookmarkFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import { IFullProduct } from "@/types";
import useHandleSave from "@/hooks/useHandleSave";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";

type Props = {
  product: IFullProduct;
};

export default function SaveProductButton({ product }: Props) {
  const { savedProducts } = useUserStore();
  const [isSaved, setIsSaved] = useState(savedProducts.includes(product._id));
  const [count, setCount] = useState(product.likes);
  const { handleSave, isPending } = useHandleSave({
    product,
    onSuccess: (state) => {
      setCount(count + (state ? 1 : -1));
      setIsSaved(state);
    }
  });

  const handleSaveAction = () => handleSave(!isSaved);
  return (
    <button aria-label="Like Product" className="fill-black text-center" onClick={handleSaveAction}>
      <div className="rounded-full bg-gray-200 p-2">
        {isPending ? (
          <BiLoaderCircle className="animate-spin" size="25" />
        ) : (
          <BsBookmarkFill
            className={`transition-all ${isSaved ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
            size="25"
          />
        )}
      </div>
      <span className="text-blend text-sm font-semibold">{count}</span>
    </button>
  );
}
