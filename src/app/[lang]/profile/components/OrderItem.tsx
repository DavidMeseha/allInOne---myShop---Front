import { useTranslation } from "@/context/Translation";
import { OrderListItem } from "@/types";
import Link from "next/link";
import React from "react";

type Props = {
  order: OrderListItem;
};

export default function OrderItem({ order }: Props) {
  const { t, lang } = useTranslation();
  return (
    <li className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <div className="border-e pe-4 text-lg font-bold">#{order.id}</div>
        <div>
          <p className="font-bold">{order.custom_order_number}</p>
          <p className="text-strongGray">{order.order_total}$</p>
        </div>
      </div>
      <Link className="text-strongGray" href={`/${lang}/profile/order-details/id`}>
        {t("details")}
      </Link>
    </li>
  );
}
