import React, { useState } from "react";
import { IFullProduct } from "@/types";
import { BsCartFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import useHandleAddToCart from "@/hooks/useHandleAddToCart";
import { useUserStore } from "@/stores/userStore";

type Props = {
  product: IFullProduct;
};

export default function AddToCartButton({ product }: Props) {
  const { cartProducts } = useUserStore();
  const [isInCart, setIsInCart] = useState(!!cartProducts.find((item) => item.product === product._id));
  const [count, setCount] = useState(product.likes);
  const { handleAddToCart, isPending } = useHandleAddToCart({
    product,
    onSuccess: (state) => {
      setCount(count + (state ? 1 : -1));
      setIsInCart(state);
    }
  });
  const addToCart = () => handleAddToCart(!isInCart, { productId: product._id, attributes: [], quantity: 1 });
  return (
    <button aria-label="Product add to cart" className="fill-black text-center" onClick={addToCart}>
      <div className="rounded-full bg-gray-200 p-2">
        {isPending ? (
          <BiLoaderCircle className="animate-spin" size="25" />
        ) : (
          <BsCartFill
            className={`p-0.5 transition-all ${isInCart ? "fill-primary" : ""} hover:fill-primary`}
            size="25"
          />
        )}
      </div>
      <span className="text-xs font-semibold text-blend">{count}</span>
    </button>
  );
}
