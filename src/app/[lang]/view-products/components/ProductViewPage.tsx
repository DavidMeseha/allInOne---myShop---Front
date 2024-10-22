"use client";

import { Product } from "@/types";
import BackArrow from "@/components/BackArrow";
import ProductSection from "@/components/ProductSection";
import ProductSectionMobile from "@/components/ProductSectionMobile";
import { useTranslation } from "@/context/Translation";
import { useRouter } from "next-nprogress-bar";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { useInView } from "react-intersection-observer";

type Props = {
  products: Product[];
  mainProduct: Product;
  isInfinteScroll?: boolean;
  loadMore?: (page: number) => Promise<Product[]>;
};

export default function ProductViewPage({ products, mainProduct, loadMore, isInfinteScroll }: Props) {
  const [productsList, setProducts] = useState<Product[]>([mainProduct, ...products]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const router = useRouter();
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (isInView && hasMore && isInfinteScroll && loadMore) {
      loadMore(page + 1).then((data) => {
        if (data.length < 1) return setHasMore(false);
        if (data.length < 4) setHasMore(false);
        setProducts([...productsList, ...data]);
        setPage(page + 1);
      });
    }
  }, [isInView]);

  console.log(isInfinteScroll);

  return (
    <div className="relative">
      <div className="hidden md:block">
        <div className="relative mx-auto mt-12 max-w-[680px] md:mt-0">
          {productsList.map((product, index) => (
            <ProductSection key={index} product={product} />
          ))}
          {isInfinteScroll ? (
            <div className="flex justify-center py-7 text-center">
              {hasMore ? <BiLoaderCircle className="animate-spin fill-primary" size={35} /> : t("endOfContent")}
            </div>
          ) : null}
        </div>
      </div>
      <div className="block md:hidden">
        <div className="fixed end-0 start-0 top-0 z-20 w-full px-2 md:hidden">
          <div className="flex justify-between py-2">
            <BackArrow color="#fff" onClick={() => router.back()} />
            <div className="w-6" />
            <div className="w-6" />
          </div>
        </div>
        <div className="relative">
          {productsList.map((product, index) => (
            <ProductSectionMobile key={index} product={product} />
          ))}
        </div>
        {isInfinteScroll ? (
          <div className="flex justify-center py-7 text-center">
            {hasMore ? <BiLoaderCircle className="animate-spin fill-primary" size={35} /> : t("endOfContent")}
          </div>
        ) : null}
      </div>
      {isInfinteScroll ? (
        <div className="absolute bottom-0 -z-40 h-[calc(100dvh*2)] w-full md:h-[900px]" ref={ref}></div>
      ) : null}
    </div>
  );
}
