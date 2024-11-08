"use client";

import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { IFullProduct, IOrder, IProductAttribute } from "@/types";
import Image from "next/image";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();

  const orderQuery = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => axios.get<IOrder>(`/api/user/order/${params.id}`).then((res) => res.data)
  });

  const order = orderQuery.data ?? null;

  return (
    <>
      <div className="p-4">
        <div className="font-bold">
          Order Number: <span className="font-normal text-strongGray">{order?._id}</span>
        </div>
        <div className="mb-2 mt-4 text-lg font-bold">{t("orderDetails.orderItems")}</div>
        <ul className="border-b-2 pb-2">
          {orderQuery.data &&
            orderQuery.data.items.map((item) => <ProductListItem item={item} key={item.product._id} />)}
        </ul>
        <div className="flex w-full flex-col-reverse gap-4 md:flex-row md:gap-10">
          <div className="grow">
            <div className="mb-2 mt-4 text-lg font-bold">Order Statuses</div>
            <div className="grid grid-cols-2 p-2">
              <div>billing:</div> <div className="text-end">{order?.billingStatus}</div>
            </div>
            <div className="grid grid-cols-2 p-2">
              <div>Shipping:</div> <div className="text-end">{order?.shippingStatus}</div>
            </div>
          </div>
          <div className="grow">
            <div className="mb-2 mt-4 text-lg font-bold">Payment</div>
            <div className="grid grow grid-cols-2 p-2">
              <div>subtotal</div>
              <div className="text-end">{order?.subTotal}$</div>
            </div>

            <div className="grid grow grid-cols-2 border-t-2 p-2">
              <div>shipping Fees</div>
              <div className="text-end">{order?.shippingFees}$</div>
            </div>

            <div className="grid grow grid-cols-2 border-t-2 p-2">
              <div>COD Fees</div>
              <div className="text-end">{order?.billingStatus === "cod" ? 10 : 0}$</div>
            </div>

            <div className="grid grow grid-cols-2 border-t-2 border-black p-2">
              <div>total</div>
              <div className="text-end">{order?.totalValue ?? 0 + (order?.billingStatus === "cod" ? 10 : 0)}$</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductListItem({
  item
}: {
  item: { product: IFullProduct; quantity: number; attributes: IProductAttribute[] };
}) {
  return (
    <li className="flex items-center justify-between py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={item.product.name}
          className="h-14 w-14 rounded-md bg-lightGray object-contain"
          height={66}
          src={item.product.pictures[0].imageUrl ?? "/images/placeholder-user.jpg"}
          width={66}
        />
        <div>
          <p className="font-bold">
            {item.product.name}
            <span className="font-normal text-strongGray"> X{item.quantity}</span>
          </p>
          <p className="text-strongGray">{item.product.price.price}$</p>
        </div>
      </div>
      <div className="relative">
        <p>{item.product.price.price * item.quantity}$</p>
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
