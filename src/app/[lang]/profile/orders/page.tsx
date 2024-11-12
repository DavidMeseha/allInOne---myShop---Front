"use client";

import { useQuery } from "@tanstack/react-query";
import OrderItem from "../components/OrderItem";
import axios from "@/lib/axios";
import { IOrder } from "@/types";
import { BiLoaderCircle } from "react-icons/bi";
import { useTranslation } from "@/context/Translation";

export default function OrdersPage() {
  const { t } = useTranslation();
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => axios.get<IOrder[]>("/api/user/orders").then((res) => res.data)
  });

  const orders = ordersQuery.data ?? [];

  return (
    <>
      <h1 className="hidden border-b py-4 text-4xl md:block">{t("profile.orders")}</h1>
      <ul>
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
