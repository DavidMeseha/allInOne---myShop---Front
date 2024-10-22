"use client";

import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { Order, OrderProduct } from "@/types";
import Image from "next/image";
import { BiDotsVerticalRounded } from "react-icons/bi";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();

  const orderQuery = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => axiosInstanceNew.get<Order>(`/api/order/details/${params.id}`).then((res) => res.data)
  });

  return (
    <>
      <div className="  px-4">
        <div className="text-4xl font-bold">#{orderQuery.data?.custom_order_number}</div>
        <p className="mt-1 text-strongGray">{orderQuery.data?.id}</p>
        <div className="mb-2 mt-4 text-lg font-bold">Order Statuses</div>
        <div>
          <p>billing: pied</p>
          <p>shpping: delevered</p>
        </div>
        <div className="mb-2 mt-4 text-lg font-bold">{t("orderDetails.orderItems")}</div>
        <ul>
          {orderQuery.data && orderQuery.data.items.map((item) => <ProductListItem key={item.id} product={item} />)}
        </ul>
      </div>
    </>
  );
}

function ProductListItem({ product }: { product: OrderProduct }) {
  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={product.product_name}
          className="h-14 w-14 rounded-full bg-lightGray object-contain"
          height={66}
          src={product.picture.image_url ?? "/images/placeholder-user.jpg"}
          width={66}
        />
        <div>
          <p className="font-bold">{product.product_name}</p>
          <p className="text-strongGray">{product.unit_price_value * product.quantity}$</p>
        </div>
      </div>
      <div className="relative">
        <button>
          <BiDotsVerticalRounded size={25} />
        </button>
        {/* {showMenu && (
          <div className="absolute end-0 z-30 w-44 rounded-md border bg-white">
            <ul className="text-sm">
              <li>
                <button className="border-b-[1px] px-4 py-2" onClick={addToCart}>
                  {!addToCartsMutation.isPending && !removeFromCartMutation.isPending ? (
                    cartItem ? (
                      t("removeFromCart")
                    ) : (
                      t("addToCart")
                    )
                  ) : (
                    <div className="text-strongGray">Updating....</div>
                  )}
                </button>
              </li>
              <li className="border-b-[1px] px-4 py-2">Save</li>
              <li className="border-b-[1px] px-4 py-2">Like</li>
              <li>
                <button
                  className="px-4 py-2"
                  onClick={() => setShare(true, () => {}, `/${lang}/product/${product.id}`)}
                >
                  Share
                </button>
              </li>
            </ul>
          </div>
        )} */}
      </div>
    </li>
  );
}
