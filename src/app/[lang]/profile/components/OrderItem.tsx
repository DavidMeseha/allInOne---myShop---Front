import { useTranslation } from "@/context/Translation";
import { IOrder } from "@/types";
import Link from "next/link";
import React from "react";

type Props = {
  order: IOrder;
};

export default function OrderItem({ order }: Props) {
  const { lang } = useTranslation();
  return (
    <li className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex grow flex-col justify-between">
        <Link className="text-lg font-bold" href={`/${lang}/profile/order-details/${order._id}`}>
          #{order._id}
        </Link>
        <p className="max-w-[250px] overflow-clip text-ellipsis text-nowrap text-xs text-strongGray">
          {order.items.map((item) => item.product.name + ", ")}
        </p>
      </div>
      <div className="w-[50px] text-strongGray">{order.shippingStatus}</div>
    </li>
  );
}
