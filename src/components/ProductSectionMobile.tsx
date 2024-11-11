"use client";

import React, { useEffect, useState } from "react";
import { IFullProduct } from "../types";
import { useGeneralStore } from "../stores/generalStore";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "./CarouselIndecator";
import ProductVendorButton from "./ProductVendorButton";
import LikeProductButton from "./LikeProductButton";
import RateProductButton from "./RateProductButton";
import SaveProductButton from "./SaveProductButton";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import { useTranslation } from "@/context/Translation";

export default function ProductSectionMobile({ product }: { product: IFullProduct }) {
  const { setIsProductMoreInfoOpen } = useGeneralStore();
  const { t } = useTranslation();
  //Carosel states
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [caroselImageIndex, setCaroselImageIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("scroll", (emblaApi) => setCaroselImageIndex(emblaApi.selectedScrollSnap()));
    return () => carouselApi.destroy();
  }, [carouselApi]);

  return (
    <>
      <div className="relative h-screen w-full snap-start bg-black" id={product._id.toString()}>
        <div className="relative flex h-[calc(100dvh-58px)] items-center">
          <Carousel className="w-full" dir="ltr" setApi={setCarouselApi}>
            <CarouselContent>
              {product.pictures.map((img, index) => (
                <CarouselItem key={index}>
                  <Image
                    alt={product.name}
                    className="object-cover"
                    height={760}
                    loading="eager"
                    priority
                    src={img.imageUrl}
                    style={{ width: "100%", height: "auto" }}
                    width={760}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="absolute bottom-0 flex h-36 w-full justify-center gap-2 bg-gradient-to-t from-black to-transparent">
            <CarouselIndecator
              array={product.pictures}
              selectedIndex={caroselImageIndex}
              setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
            />
          </div>

          {/* <div className="absolute bottom-8 h-24 max-w-[80%] overflow-clip text-ellipsis bg-gradient-to-b from-white to-transparent bg-clip-text ps-4 text-transparent">
            <p dangerouslySetInnerHTML={{ __html: product.fullDescription ?? "" }}></p>
          </div> */}

          {/* <button
            className="absolute bottom-8 start-1/3 z-10 p-1 text-sm text-primary underline"
            onClick={() => setIsProductMoreInfoOpen(true, product._id)}
          >
            {t("showMore")}...
          </button> */}

          <div className="absolute bottom-1 end-0">
            <div className="relative bottom-0 end-0 flex flex-col" id={`PostMainLikes-${product?._id}`}>
              <ProductVendorButton vendor={product.vendor} />
              <LikeProductButton product={product} />
              <RateProductButton product={product} />
              <SaveProductButton product={product} />
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
