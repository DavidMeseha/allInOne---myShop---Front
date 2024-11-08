"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "./CarouselIndecator";
import LikeProductButton from "./LikeProductButton";
import RateProductButton from "./RateProductButton";
import SaveProductButton from "./SaveProductButton";
import AddToCartButton from "./AddToCartButton";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import { manipulateDescription } from "@/lib/misc";
import DOMPurify from "dompurify";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";
import Button from "./Button";
import { useUser } from "@/context/user";
import { useGeneralStore } from "@/stores/generalStore";

export default function ProductSection({ product }: { product: IFullProduct }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [caroselImageIndex, setCaroselImageIndex] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const { t, lang } = useTranslation();
  const { following, setFollowedVendors } = useUserStore();
  const { setIsLoginOpen } = useGeneralStore();
  const { user } = useUser();
  const descriptionRef = useRef(manipulateDescription(product.fullDescription));
  const [main, extend] = descriptionRef.current;

  const followMutation = useMutation({
    mutationKey: ["followVendor", product.vendor._id],
    mutationFn: () => axios.post(`/api/user/followVendor/${product.vendor._id}`),
    onSuccess: () => {
      setFollowedVendors();
      toast.success("Vendor followed successfully");
    }
  });

  const unfollowMutation = useMutation({
    mutationKey: ["followVendor", product.vendor._id],
    mutationFn: () => axios.post(`/api/user/unfollowVendor/${product.vendor._id}`),
    onSuccess: () => {
      setFollowedVendors();
      toast.warning("Vendor unFollowed");
    }
  });

  const handleFollowClick = () => {
    if (user?.isRegistered)
      following.includes(product.vendor._id) ? unfollowMutation.mutate() : followMutation.mutate();
    else setIsLoginOpen(true);
  };

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("scroll", (emblaApi) => setCaroselImageIndex(emblaApi.selectedScrollSnap()));
    return () => carouselApi.destroy();
  }, [carouselApi]);

  return (
    <div className="flex border-b py-6" id={`PostMain-${product._id}`}>
      <div className="w-11">
        <Link aria-label="Navigate to specific vendor profile" href={`/${lang}/profile/vendor/${product.vendor._id}`}>
          <Image
            alt={product.vendor.name}
            className="h-14 w-14 rounded-full object-cover"
            height={56}
            loading="lazy"
            sizes=""
            src={product.vendor?.imageUrl}
            width={56}
          />
        </Link>
      </div>

      <div className="grow pe-4 ps-3">
        <div className="flex items-center justify-between pb-1">
          <div>
            <Link
              aria-label="Navigate to product page"
              className="cursor-pointer font-bold hover:underline"
              href={`/product/${product._id}`}
            >
              {product.name}
            </Link>
            <p className="text-sm text-strongGray">
              {t("soldBy")}:{" "}
              <Link className="hover:text-primary" href={`/${lang}/vandor/${product.vendor._id}`}>
                {product.vendor.name}
              </Link>
            </p>
          </div>

          <Button
            className="border border-primary bg-white fill-primary px-5 py-0.5 text-sm font-semibold text-primary hover:bg-[#ffeef2]"
            isLoading={followMutation.isPending || unfollowMutation.isPending}
            onClick={handleFollowClick}
          >
            {following.includes(product.vendor._id) ? t("unfollow") : t("follow")}
          </Button>
        </div>
        <p className="max-w-[300px] text-[15px] md:max-w-[400px]">
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(main) }}></span>
          {readMore ? <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(extend) }}></span> : null}
          {extend.length > 0 ? (
            <>
              {!readMore && <span>...</span>}
              <span
                aria-label="read more"
                className="cursor-pointer text-sm text-primary hover:underline"
                onClick={() => setReadMore(!readMore)}
              >
                {" "}
                {readMore ? t("readLess") : t("readMore")}
              </span>
            </>
          ) : null}
        </p>
        <div className="pb-0.5 text-[14px] text-gray-500">
          {product.productTags.length > 0
            ? product.productTags.map((tag) => (
                <Link
                  aria-label="Navigate to a tag products"
                  className="me-4 hover:underline"
                  dir="ltr"
                  href={`/${lang}/profile/tag/${tag._id}`}
                  key={tag._id}
                >
                  #{tag.name}
                </Link>
              ))
            : null}
        </div>

        <div className="mt-2.5 flex items-end">
          <div className="relative flex h-[480px] w-[260px] cursor-grab items-center overflow-hidden rounded-xl bg-black">
            {product.pictures.length > 1 ? (
              <>
                <Carousel className="w-full" dir="ltr" setApi={setCarouselApi}>
                  <CarouselContent>
                    {product.pictures.map((img) => (
                      <CarouselItem className="relative flex h-[480px] items-center" key={img._id}>
                        <Image
                          alt={product.name}
                          className="object-cover"
                          height={480}
                          loading="eager"
                          priority
                          src={img.imageUrl}
                          width={260}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <CarouselIndecator
                  array={product.pictures}
                  className="absolute bottom-0 p-4"
                  selectedIndex={caroselImageIndex}
                  setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
                />
              </>
            ) : (
              <Image
                alt={product.name}
                className="object-cover"
                height={480}
                loading="eager"
                priority
                src={product.pictures[0]?.imageUrl ?? "/images/placeholder.png"}
                width={260}
              />
            )}
          </div>
          <div className="relative flex flex-col items-center" id={`PostMainLikes-${product._id}`}>
            <LikeProductButton product={product} />
            <RateProductButton product={product} />
            <SaveProductButton product={product} />
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
