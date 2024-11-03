"use client";

import CartItem from "@/components/CartItem";
import Link from "next/link";
import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import { IFullProduct, IProductAttribute } from "@/types";
import Button from "@/components/Button";
import { useUser } from "@/context/user";
import { useGeneralStore } from "@/stores/generalStore";
import { useRouter } from "next-nprogress-bar";
import BackArrow from "@/components/BackArrow";

export default function Page() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { setIsLoginOpen } = useGeneralStore();
  const router = useRouter();

  const checkoutQuery = useQuery({
    queryKey: ["cartProducts"],
    queryFn: () =>
      axiosInstanceNew
        .get<{
          total: number;
          cartItems: { product: IFullProduct; quantity: number; attributes: IProductAttribute[] }[];
        }>("/api/user/checkout")
        .then((res) => res.data)
  });

  const cartItems = checkoutQuery.data?.cartItems ?? [];
  const total = checkoutQuery.data?.total ?? 0;

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-20 w-full border-b bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">{t("cart")}</h1>
          <div className="w-6" />
        </div>
      </div>
      {cartItems.length > 0 ? (
        <>
          <div className="sticky top-11 z-30 flex items-center justify-between border-b bg-white p-4 pb-2 md:top-[60px] md:mx-0">
            <h1 className="hidden text-3xl font-bold md:block">Your Cart</h1>
            <Button
              className="ms-auto block w-full rounded-md bg-primary px-6 py-3 font-semibold text-white md:w-auto"
              isLoading={checkoutQuery.isFetching}
              onClick={() => (user?.isRegistered ? router.push("/checkout") : setIsLoginOpen(true))}
            >
              <div className="flex w-full justify-between gap-8">
                <div>Checkout({cartItems.length})</div>
                <div>{total}$</div>
              </div>
            </Button>
          </div>

          {cartItems.map((item) => (
            <CartItem
              attributes={item.attributes}
              canEdit
              key={item.product._id}
              product={item.product}
              quantity={item.quantity}
            />
          ))}
        </>
      ) : (
        <>
          <div className="mt-44 flex flex-col items-center justify-center gap-2">
            <div className="text-2xl font-bold">{t("cart.empty")}</div>
            <Link className="bg-primary px-4 py-2 font-bold text-white" href="/">
              {t("cart.shopNow")}
            </Link>
          </div>
        </>
      )}
    </>
  );
}
