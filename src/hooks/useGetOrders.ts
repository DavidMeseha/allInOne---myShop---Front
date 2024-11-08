import { Order } from "@/types";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Response {
  orders: Order[];
}

interface HookProps {
  onSuccess?: (data: Response) => void;
  onError?: (err: AxiosError) => void;
}

const useGetOrders = ({ onSuccess, onError }: HookProps) => {
  const mutation = useQuery({
    queryKey: ["uploadImage"],
    queryFn: () =>
      axios
        .get<Response>("/orders")
        .then((res) => {
          onSuccess && onSuccess(res.data);
          return res.data.orders;
        })
        .catch((err: AxiosError) => {
          onError && onError(err);
          return [];
        })
  });
  return mutation;
};

export default useGetOrders;
