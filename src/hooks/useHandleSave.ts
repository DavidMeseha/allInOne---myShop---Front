import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-toastify";

type Props = {
  product: IFullProduct;
  onSuccess?: (liked: boolean) => void;
  onError?: (liked: boolean) => void;
  onClick?: (liked: boolean) => void;
};

export default function useHandleSave({ product, onSuccess, onError, onClick }: Props) {
  const { setSaves, user } = useUserStore();
  const queryClient = useQueryClient();
  const actionTimeoutRef = useRef<number>();
  const sourceOfTrouthTimeoutRef = useRef<number>();

  const saveMutation = useMutation({
    mutationKey: ["save", product.seName],
    mutationFn: () => axios.post(`/api/user/saveProduct/${product._id}`).catch(() => null),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onSuccess: () => onSuccess && onSuccess(true),
    onError: () => onError && onError(true)
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product.seName],
    mutationFn: () => axios.post(`/api/user/unsaveProduct/${product._id}`).catch(() => null),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onSuccess: () => onSuccess && onSuccess(false),
    onError: () => onError && onError(false)
  });

  const handleSave = async (save: boolean) => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    if (sourceOfTrouthTimeoutRef.current) clearTimeout(sourceOfTrouthTimeoutRef.current);

    if (user && !user.isRegistered) return toast.warn("You need to login to perform action", { toastId: "saveError" });
    onClick && onClick(save);
    actionTimeoutRef.current = window.setTimeout(async () => {
      if (save) await saveMutation.mutateAsync();
      else await unsaveMutation.mutateAsync();
      sourceOfTrouthTimeoutRef.current = window.setTimeout(() => {
        setSaves();
      }, 500);
    }, 200);
  };

  return { handleSave, isPending: saveMutation.isPending || unsaveMutation.isPending };
}
