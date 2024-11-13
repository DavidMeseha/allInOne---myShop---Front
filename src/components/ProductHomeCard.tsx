import { IFullProduct } from "@/types";
import Image from "next/image";
import React, { useState } from "react";
import { LocalLink } from "./LocalizedNavigation";
import {
  RiBookmark2Line,
  RiHeart2Line,
  RiShoppingCart2Line,
  RiShoppingCartLine,
  RiUserFollowLine
} from "react-icons/ri";
import { useUserStore } from "@/stores/userStore";
import Button from "./Button";
import useHandleLike from "@/hooks/useHandleLike";
import useHandleSave from "@/hooks/useHandleSave";
import useHandleAddToCart from "@/hooks/useHandleAddToCart";
import RatingStars from "./RatingStars";
import { BiCartAdd } from "react-icons/bi";

type Props = {
  product: IFullProduct;
};

export default function ProductHomeCard({ product }: Props) {
  const { cartProducts, likes, savedProducts, reviewedProducts } = useUserStore();
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

  const handleLikeAction = () => likeHandler.handleLike(!is.liked);
  const handleSaveAction = () => saveHandler.handleSave(!is.saved);
  const handleAddToCart = () =>
    addToCartHandler.handleAddToCart(!is.inCart, { productId: product._id, attributes: [], quantity: 1 });

  return (
    <div className="w-full overflow-hidden rounded-sm border bg-white">
      <div className="p-1">
        <Image
          alt="Converse sneakers"
          className="h-52 w-full object-cover"
          height={200}
          src={product.pictures[0].imageUrl}
          width={200}
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 px-2 sm:px-4">
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
        <RatingStars
          className=""
          rate={product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews}
          size={15}
        />
      </div>

      <div className="mt-4 flex border-t border-gray-200">
        <Button
          className={`basis-1/3 border-e fill-black px-1 py-1 ${is.inCart ? "bg-green-200" : "bg-white"}`}
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
          className={`basis-1/3 border-e fill-black px-1 py-1 ${is.liked ? "bg-red-200" : "bg-white"}`}
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
          className={`basis-1/3 border-e fill-black px-1 py-1 ${is.saved ? "bg-yellow-200" : "bg-white"}`}
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
