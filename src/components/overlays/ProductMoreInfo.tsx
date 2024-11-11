"use client";

import React, { useEffect, useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useGeneralStore } from "@/stores/generalStore";
import { selectDefaultAttributes } from "@/lib/misc";
import { useUserStore } from "@/stores/userStore";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "../CarouselIndecator";
import { LocalLink } from "@/components/LocalizedNavigation";
import { BiLoaderCircle } from "react-icons/bi";
import { useUser } from "@/context/user";
import ProductAttributes from "../ProductAttributes";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { IFullProduct, IProductAttribute } from "../../types";

export default function ProductMoreInfoOverlay() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [imageIndex, setImageIndex] = useState(0);
  const { setCartProducts } = useUserStore();
  const { user } = useUser();
  const [activeTap, setActiveTap] = useState<"description" | "reviews">("description");
  const { setIsProductMoreInfoOpen, overlayProductId } = useGeneralStore();
  const [customAttributes, setCustomAttributes] = useState<IProductAttribute[]>([]);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("scroll", (emblaApi) => setImageIndex(emblaApi.selectedScrollSnap()));
    return () => carouselApi.destroy();
  }, [carouselApi]);

  const addToCartMutation = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (props: { productId: string; attributes: IProductAttribute[]; quantity: number }) =>
      axios.post(`/api/common/cart/add/${props.productId}`),
    onSuccess: () => {
      setIsProductMoreInfoOpen(false);
      setCartProducts();
    }
  });

  const productQuery = useQuery({
    queryKey: ["product", overlayProductId],
    queryFn: () =>
      axios.get<IFullProduct>(`/api/catalog/product/${overlayProductId}`).then((res) => {
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

  const addToCartClickHandle = () => {
    user &&
      addToCartMutation.mutate({
        productId: overlayProductId ?? "",
        attributes: customAttributes,
        quantity: 1
      });
  };

  return (
    <OverlayLayout className="relative" close={() => setIsProductMoreInfoOpen(false)}>
      {product && product?.pictures.length > 1 ? (
        <>
          <Carousel dir="ltr" setApi={setCarouselApi}>
            <CarouselContent>
              {product?.pictures.map((item) => (
                <CarouselItem className="relative h-64 basis-full" key={item._id}>
                  <Image alt={product.name} className="object-contain" fill src={item.imageUrl} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <CarouselIndecator
            array={product.pictures}
            className="my-4"
            selectedIndex={imageIndex}
            setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
          />
        </>
      ) : (
        <div className="relative mb-4 h-64">
          <Image
            alt={product?.name ?? "product"}
            className="mb-4 object-contain"
            fill
            src={product?.pictures[0].imageUrl || "/images/placeholder.png"}
          />
        </div>
      )}
      <h1 className="text-2xl font-bold">{product?.name}</h1>
      <LocalLink
        className="text-base text-strongGray hover:text-primary hover:underline"
        href={`/vendor/${product?.vendor._id}`}
      >
        Sold By: {product?.vendor.name}
      </LocalLink>
      <div className="mb-2 text-lg font-bold">{product?.price.price}$</div>
      <div className="mb-4 text-center text-sm text-strongGray">
        {product?.productTags
          ? product?.productTags.map((tag, index) => (
              <LocalLink className="me-4 hover:underline" dir="ltr" href={`/profile/tag/${tag._id}`} key={index}>
                #{tag.name}
              </LocalLink>
            ))
          : null}
      </div>
      {product && product.productAttributes.length > 0 ? (
        <div className="mb-4">
          <ProductAttributes
            customAttributes={customAttributes}
            handleChange={handleAttributesChange}
            productAttributes={product.productAttributes}
          />
        </div>
      ) : null}
      <ul className="sticky -top-4 z-20 flex w-full items-center border-b bg-white">
        <li
          className={`w-full ${activeTap === "description" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
        >
          <a className="flex justify-center py-2" onClick={() => setActiveTap("description")}>
            Description
          </a>
        </li>
        <li className={`w-full ${activeTap === "reviews" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}>
          <a className="flex justify-center py-2" onClick={() => setActiveTap("reviews")}>
            Reviews
          </a>
        </li>
      </ul>
      <div className="mt-4 px-2 pb-20">
        {activeTap === "description" ? (
          <p dangerouslySetInnerHTML={{ __html: product?.fullDescription ?? "" }}></p>
        ) : null}

        {activeTap === "reviews"
          ? product?.productReviews?.map((review) => (
              <div className="mb-4 flex items-start gap-3" key={review._id}>
                <Image
                  alt={review.customer.firstName + " " + review.customer.lastName}
                  className="h-10 w-10 rounded-full bg-lightGray"
                  height={50}
                  src={review.customer.imageUrl}
                  width={50}
                />
                <div className="w-11/12 rounded-md bg-lightGray p-2">
                  <div className="text-sm font-bold">{review.customer.firstName + " " + review.customer.lastName}</div>
                  <p className="text-sm">{review.reviewText}</p>
                </div>
              </div>
            ))
          : null}

        <div className="fixed bottom-0 end-0 start-0 z-30 border-t bg-white px-6 py-4">
          <button
            className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-white"
            onClick={addToCartClickHandle}
          >
            {addToCartMutation.isPending ? (
              <BiLoaderCircle className="animate-spin fill-white" size="24" />
            ) : (
              "Add To Cart"
            )}
          </button>
        </div>
      </div>
    </OverlayLayout>
  );
}
