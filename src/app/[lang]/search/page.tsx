"use client";

// import { debounce } from "debounce";
import { useRouter } from "next-nprogress-bar";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import ProductItem from "../../../components/ProductItem";
import BackArrow from "@/components/BackArrow";
import { useTranslation } from "@/context/Translation";
import { IFullProduct } from "@/types";

export default function SearchPage() {
  const router = useRouter();
  const [data] = useState<IFullProduct[]>([]);
  const { t } = useTranslation();

  // const handleSearch = debounce(async (text: string) => {
  //   if (text == "") return setData([]);
  //   setData(allProducts.filter((product) => product.name.toLowerCase().includes(text.toLowerCase())));
  // }, 500);

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-20 border bg-white px-2 md:hidden">
        <div className="flex items-center justify-between gap-4 py-2">
          <BackArrow onClick={() => router.back()} />
          <div className="relative flex w-full items-center justify-end rounded-full bg-[#F1F1F2] p-1">
            <input
              className="my-2 w-full border-0 bg-transparent py-0 ps-3 text-base placeholder-[#838383] focus:border-0 focus:ring-0"
              placeholder={t("search")}
              type="text"
              // onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="flex items-center border-s border-s-gray-300 px-3 py-1">
              <BiSearch color="#A1A2A7" size="22" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        {data.length > 0 ? data?.map((prod) => <ProductItem key={prod._id} product={prod} />) : null}
      </div>
    </>
  );
}
