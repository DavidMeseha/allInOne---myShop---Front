import { IFullProduct } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { LocalLink } from "./LocalizedNavigation";
import { RiBookmark2Line, RiHeart2Line, RiShoppingCartLine } from "react-icons/ri";
import { useUserStore } from "@/stores/userStore";
import Button from "./Button";
import useHandleLike from "@/hooks/useHandleLike";
import useHandleSave from "@/hooks/useHandleSave";
import useHandleAddToCart from "@/hooks/useHandleAddToCart";
import RatingStars from "./RatingStars";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "./CarouselIndecator";
import { useGeneralStore } from "@/stores/generalStore";
import { useUser } from "@/context/user";

type Props = {
  product: IFullProduct;
};

export default function ProductHomeCard({ product }: Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [caroselImageIndex, setCaroselImageIndex] = useState(0);
  const { cartProducts, likes, savedProducts, reviewedProducts } = useUserStore();
  const { setIsAddReviewOpen, setIsLoginOpen } = useGeneralStore();
  const [counters, setCounters] = useState({
    carts: product.carts,
    likes: product.likes,
    saves: product.saves,
    reviews: product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews
  });
  const [is, setIs] = useState({
    liked: likes.includes(product._id),
    saved: savedProducts.includes(product._id),
    reviewed: reviewedProducts.includes(product._id),
    inCart: !!cartProducts.find((item) => item.product === product._id)
  });
  const { user } = useUser();

  const likeHandler = useHandleLike({
    product,
    onSuccess: (state) => {
      setCounters({ ...counters, likes: counters.likes + (state ? 1 : -1) });
      setIs({ ...is, liked: state });
    }
  });

  const saveHandler = useHandleSave({
    product,
    onSuccess: (state) => {
      setCounters({ ...counters, saves: counters.saves + (state ? 1 : -1) });
      setIs({ ...is, saved: state });
    }
  });

  const addToCartHandler = useHandleAddToCart({
    product,
    onSuccess: (state) => {
      setCounters({ ...counters, carts: counters.carts + (state ? 1 : -1) });
      setIs({ ...is, inCart: state });
    }
  });

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("scroll", (emblaApi) => setCaroselImageIndex(emblaApi.selectedScrollSnap()));
    return () => carouselApi.destroy();
  }, [carouselApi]);

  const handleLikeAction = () => likeHandler.handleLike(!is.liked);
  const handleSaveAction = () => saveHandler.handleSave(!is.saved);
  const handleAddToCart = () =>
    addToCartHandler.handleAddToCart(!is.inCart, { productId: product._id, attributes: [], quantity: 1 });

  return (
    <div className="w-full overflow-hidden rounded-sm border bg-white">
      <div className="relative">
        {product.pictures.length > 1 ? (
          <>
            <Carousel className="w-full" dir="ltr" setApi={setCarouselApi}>
              <CarouselContent>
                {product.pictures.map((img) => (
                  <CarouselItem className="relative flex h-52 items-center" key={img._id}>
                    <Image
                      alt={product.name}
                      className="h-full w-full object-contain"
                      height={200}
                      src={img.imageUrl}
                      width={200}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <CarouselIndecator
              array={product.pictures}
              className="absolute bottom-2 p-4"
              selectedIndex={caroselImageIndex}
              setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
            />
          </>
        ) : (
          <Image
            alt="Converse sneakers"
            className="h-52 w-full object-contain"
            height={200}
            src={product.pictures[0].imageUrl}
            width={200}
          />
        )}
      </div>

      <div className="mt-2 flex flex-col gap-1 px-2 sm:px-4">
        <LocalLink
          className="overflow-clip text-ellipsis text-nowrap font-semibold text-gray-800 hover:underline"
          href={`/product/${product._id}`}
        >
          {product.name}
        </LocalLink>
        <p className="-mt-1 text-sm text-strongGray">
          sold by:{" "}
          <LocalLink className="hover:text-primary" href={`/profile/vendor/${product.vendor._id}`}>
            {product.vendor.name}
          </LocalLink>
        </p>
        <span className="font-semibold text-gray-800">{product.price.price}$</span>
        <div className="flex items-center">
          <RatingStars
            rate={product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews}
            size={15}
          />
          <button
            className="px-2 text-lg text-primary"
            onClick={() => (user?.isRegistered ? setIsAddReviewOpen(true) : setIsLoginOpen(true))}
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 flex border-t border-gray-200">
        <Button
          className={`basis-1/3 rounded-none border-e fill-black p-1 ${is.inCart ? "bg-green-200" : "bg-white"}`}
          isLoading={addToCartHandler.isPending}
          spinnerSize="20"
          onClick={handleAddToCart}
        >
          <div className="flex items-center justify-center gap-1">
            <RiShoppingCartLine size={20} />
            <span className="hidden text-sm sm:inline">{counters.carts}</span>
          </div>
        </Button>
        <Button
          className={`basis-1/3 rounded-none border-e fill-black p-1 ${is.liked ? "bg-red-200" : "bg-white"}`}
          isLoading={likeHandler.isPending}
          spinnerSize="20"
          onClick={handleLikeAction}
        >
          <div className="flex items-center justify-center gap-1">
            <RiHeart2Line size={20} />
            <span className="hidden text-sm sm:inline">{counters.likes}</span>
          </div>
        </Button>
        <Button
          className={`basis-1/3 rounded-none fill-black p-1 ${is.saved ? "bg-yellow-200" : "bg-white"}`}
          isLoading={saveHandler.isPending}
          spinnerSize="20"
          onClick={handleSaveAction}
        >
          <div className="flex items-center justify-center gap-1">
            <RiBookmark2Line size={20} />
            <span className="hidden text-sm sm:inline">{counters.saves}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
