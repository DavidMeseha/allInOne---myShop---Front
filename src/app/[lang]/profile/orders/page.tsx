"use client";

import { useQuery } from "@tanstack/react-query";
import OrderItem from "../components/OrderItem";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { IOrder } from "@/types";
import { BiLoaderCircle } from "react-icons/bi";

export default function OrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => axiosInstanceNew.get<IOrder[]>("/api/user/orders").then((res) => res.data)
  });

  const orders = ordersQuery.data ?? [];

  return (
    <>
      <ul className=" ">
        {ordersQuery.isFetching ? (
          <li className="flex w-full flex-col items-center justify-center py-2">
            <BiLoaderCircle className="animate-spin fill-primary" size={35} />
          </li>
        ) : orders.length > 0 ? (
          orders.map((order) => <OrderItem key={order._id} order={order} />)
        ) : (
          <li className="text-center text-strongGray">No Orders Avilable</li>
        )}
      </ul>
    </>
  );
}
