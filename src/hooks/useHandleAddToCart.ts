import { queryClient } from "@/components/layout/MainLayout";
import axios from "@/lib/axios";
import { useGeneralStore } from "@/stores/generalStore";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct, IProductAttribute } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Props = {
  product: IFullProduct;
  onSuccess?: (liked: boolean) => void;
};

interface MutationProps {
  attributes: IProductAttribute[];
  quantity: number;
}

export default function useHandleAddToCart({ product, onSuccess }: Props) {
  const { setCartItems, user } = useUserStore();
  const { setIsProductAttributesOpen } = useGeneralStore();

  const addToCartMutation = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (props: MutationProps) =>
      axios.post(`/api/common/cart/add/${product._id}`, {
        attributes: props.attributes,
        quantity: props.quantity
      }),
    onSuccess: () => {
      setCartItems();
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      onSuccess && onSuccess(true);
    }
  });

  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product.seName],
    mutationFn: () => axios.delete(`/api/common/cart/remove/${product._id}`),
    onSuccess: () => {
      setCartItems();
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      onSuccess && onSuccess(false);
    }
  });

  const handleAddToCart = (addToCart: boolean, props: MutationProps) => {
    if (!user || addToCartMutation.isPending || removeFromCartMutation.isPending) return;
    if (product.hasAttributes && addToCart)
      return setIsProductAttributesOpen(true, product._id, "Add To Cart", (attributes) =>
        addToCartMutation.mutate({ attributes, quantity: 1 })
      );
    if (addToCart && !product.hasAttributes) return addToCartMutation.mutate(props);
    removeFromCartMutation.mutate();
  };

  return { handleAddToCart, isPending: addToCartMutation.isPending || removeFromCartMutation.isPending };
}
