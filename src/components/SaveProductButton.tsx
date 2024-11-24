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
  const { saves, setSaves } = useUserStore();
  const [count, setCount] = useState(product.likes);
  const inSaves = saves.find((item) => item === product._id);
  const { handleSave, isPending } = useHandleSave({
    product,
    onSuccess: (state) => {
      setCount(count + (state ? 1 : -1));
      const temp = [...saves];
      inSaves ? temp.splice(temp.indexOf(inSaves), 1) : temp.push(product._id);
      setSaves([...temp]);
    }
  });

  const handleSaveAction = () => handleSave(!inSaves);
  return (
    <button aria-label="Like Product" className="fill-black text-center" onClick={handleSaveAction}>
      <div className="rounded-full bg-gray-200 p-2">
        {isPending ? (
          <BiLoaderCircle className="animate-spin" size="25" />
        ) : (
          <BsBookmarkFill
            className={`transition-all ${inSaves ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
            size="25"
          />
        )}
      </div>
      <span className="text-blend text-sm font-semibold">{count}</span>
    </button>
  );
}
