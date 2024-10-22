"use client";

import { useQuery } from "@tanstack/react-query";
import OrderItem from "../components/OrderItem";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { OrderListItem } from "@/types";
import { BiLoaderCircle } from "react-icons/bi";

export default function OrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axiosInstanceNew.get<{ orders: OrderListItem[] }>("/api/order/CustomerOrders").then((res) => res.data.orders)
  });

  console.log(ordersQuery.data);
  return (
    <>
      <ul className=" ">
        {ordersQuery.isFetching ? (
          <li className="flex w-full flex-col items-center justify-center py-2">
            <BiLoaderCircle className="animate-spin fill-primary" size={35} />
          </li>
        ) : ordersQuery.data && ordersQuery.data?.length > 0 ? (
          ordersQuery.data?.map((order) => <OrderItem key={order.id} order={order} />)
        ) : (
          <li className="text-center text-strongGray">No Orders Avilable</li>
        )}
        {/* <OrderItem
          key={50}
          order={{
            id: 10,
            is_return_request_allowed: true,
            custom_order_number: "123456",
            order_total: "1000",
            created_on: "",
            shipping_status: "",
            payment_status: "",
            order_status_enum: 1,
            order_status: ""
          }}
        /> */}
      </ul>
    </>
  );
}
