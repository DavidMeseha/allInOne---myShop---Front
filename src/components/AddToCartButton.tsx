import React, { useEffect, useState } from "react";
import { IFullProduct, IProductAttribute } from "@/types";
import { BsCartFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import { useUser } from "@/context/user";
import { useGeneralStore } from "../stores/generalStore";
import { useUserStore } from "../stores/userStore";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

type Props = {
  product: IFullProduct;
};

export default function AddToCartButton({ product }: Props) {
  const { user } = useUser();
  const { setCartProducts, cartProducts } = useUserStore();
  const { setIsProductAttributesOpen } = useGeneralStore();
  const [cartItem, setCartItem] = useState<boolean>(false);
  const [count, setCounter] = useState(product.carts);
  const addToCartMutation = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (props: { productId: string; attributes: IProductAttribute[]; quantity: number }) =>
      axios.post(`/api/common/cart/add/${props.productId}`, {
        attributes: props.attributes,
        quantity: props.quantity
      }),
    onSuccess: () => {
      setCartProducts();
      setCartItem(true);
      setCounter(count + 1);
    }
  });

  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product._id],
    mutationFn: () => axios.delete(`/api/common/cart/remove/${product._id}`),
    onSuccess: () => {
      setCartProducts();
      setCartItem(false);
      setCounter(count - 1);
    }
  });

  useEffect(() => {
    setCartItem(!!cartProducts.findLast((item) => item.product === product._id));
  }, [cartProducts]);

  const addToCart = async () => {
    if (!user) return;
    if (!cartItem && product.hasAttributes)
      return setIsProductAttributesOpen(true, product._id, "Add To Cart", (attributes) =>
        addToCartMutation.mutate({ productId: product._id, attributes, quantity: 1 })
      );
    if (cartItem) {
      removeFromCartMutation.mutate();
    } else {
      addToCartMutation.mutate({ productId: product._id, attributes: [], quantity: 1 });
    }
  };

  return (
    <button className="overflow-hidden px-2 text-center" onClick={addToCart}>
      <div className="cursor-pointer rounded-full bg-gray-200 p-2">
        {!addToCartMutation.isPending && !removeFromCartMutation.isPending ? (
          <BsCartFill
            className={`p-0.5 transition-all ${cartItem ? "fill-primary" : ""} hover:fill-primary`}
            size="25"
          />
        ) : (
          <BiLoaderCircle className="animate-spin" size="25" />
        )}
      </div>
      <span className="text-xs font-semibold text-white md:text-gray-800">{count}</span>
    </button>
  );
}
