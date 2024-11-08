import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface HookProps {
  onError?: () => void;
  onSuccess?: () => void;
}

const useRemoveFromCarts = ({ onSuccess, onError }: HookProps) => {
  const mutation = useMutation({
    mutationKey: ["addToCarts"],
    mutationFn: (id: string) => axios.delete(`/shopping_cart_items/${id}`),
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.warning("Product removed");
    },
    onError: () => {
      onError && onError();
      toast.error("Faild to remove product");
    }
  });
  return mutation;
};

export default useRemoveFromCarts;
