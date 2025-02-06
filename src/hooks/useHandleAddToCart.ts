import { queryClient } from "@/components/layout/MainLayout";
import axios from "@/lib/axios";
import { useGeneralStore } from "@/stores/generalStore";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct, IProductAttribute } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

interface CartHookProps {
  product: IFullProduct;
  onSuccess?: (added: boolean) => void;
}

interface CartMutationProps {
  attributes: IProductAttribute[];
  quantity: number;
}

export default function useHandleAddToCart({ product, onSuccess }: CartHookProps) {
  const { setCartItems, user } = useUserStore();
  const { setIsProductAttributesOpen } = useGeneralStore();

  const addToCartMutation = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: ({ attributes, quantity }: CartMutationProps) =>
      axios.post(`/api/common/cart/add/${product._id}`, {
        attributes,
        quantity
      }),
    onSuccess: () => {
      setCartItems();
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      onSuccess?.(true);
    }
  });

  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product.seName],
    mutationFn: () => axios.delete(`/api/common/cart/remove/${product._id}`),
    onSuccess: () => {
      setCartItems();
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      onSuccess?.(false);
    }
  });

  // Helper function to handle product attributes
  const handleProductAttributes = useCallback(
    (props: CartMutationProps) => {
      setIsProductAttributesOpen(true, product._id, "Add To Cart", (attributes) =>
        addToCartMutation.mutate({ ...props, attributes })
      );
    },
    [product._id, addToCartMutation, setIsProductAttributesOpen]
  );

  // Main handler function
  const handleAddToCart = (addToCart: boolean, props: CartMutationProps) => {
    if (!user) return;
    if (addToCartMutation.isPending || removeFromCartMutation.isPending) return;

    if (addToCart) {
      if (product.hasAttributes) {
        return handleProductAttributes(props);
      }
      return addToCartMutation.mutate(props);
    }

    removeFromCartMutation.mutate();
  };

  const isPending = addToCartMutation.isPending || removeFromCartMutation.isPending;

  return { handleAddToCart, isPending };
}
