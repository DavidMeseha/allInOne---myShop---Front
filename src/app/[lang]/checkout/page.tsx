"use client";

import { useState } from "react";
import { IAddress, IFullProduct, IProductAttribute } from "@/types";
import ShippingForm from "./components/ShippingForm";
import BillingForm from "./components/BillingForm";
import CartItem from "../../../components/CartItem";
import { useRouter } from "next-nprogress-bar";
import BackArrow from "@/components/BackArrow";
import { useTranslation } from "@/context/Translation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import Button from "@/components/Button";
import { toast } from "react-toastify";

interface IBillingForm {
  billingAddressId: string;
  method: "cod" | "card";
  cardInfo: {
    code: string;
    exp: string;
    holder: string;
  };
}

interface IShippingForm {
  shippingAddressId: string;
  method: "ground" | "air";
}

const initialCheckoutForm: { billing: IBillingForm; shipping: IShippingForm } = {
  billing: {
    billingAddressId: "",
    method: "cod",
    cardInfo: {
      code: "",
      exp: "",
      holder: ""
    }
  },
  shipping: {
    shippingAddressId: "",
    method: "ground"
  }
};

export default function CheckoutPage() {
  const [activeTap, setActiveTap] = useState<"shipping" | "billing" | "summary">("shipping");
  const [form, setForm] = useState(initialCheckoutForm);
  const { t } = useTranslation();
  const router = useRouter();

  const placeOrderMutation = useMutation({
    mutationKey: ["placeOrder"],
    mutationFn: () =>
      axiosInstanceNew.post(`/api/user/order/submit`, {
        ...form
      }),
    onSuccess: (data) => {
      console.log(data.data);
      toast.success("Order Placed Successfully");
    }
  });

  const checkoutQuery = useQuery({
    queryKey: ["cartProducts"],
    queryFn: () =>
      axiosInstanceNew
        .get<{
          total: number;
          cartItems: {
            product: IFullProduct;
            quantity: number;
            attributes: IProductAttribute[];
          }[];
          addresses: IAddress[];
        }>("/api/user/checkout")
        .then((res) => {
          setForm({ ...form, billing: { ...form.billing, billingAddressId: res.data.addresses[0]._id } });
          setForm({ ...form, shipping: { ...form.shipping, shippingAddressId: res.data.addresses[0]._id } });
          return res.data;
        })
  });

  const shoppingCartProducts = checkoutQuery.data?.cartItems ?? [];
  const userAddresses = checkoutQuery.data?.addresses ?? [];

  const handleFieldOnChangeBilling = (value: string, name: string) => {
    if (name === "cardInfo")
      return setForm({
        ...form,
        billing: {
          ...form.billing,
          cardInfo: { ...form.billing.cardInfo, [name as keyof typeof form.billing.cardInfo]: value }
        }
      });

    setForm({
      ...form,
      billing: { ...form.billing, [name]: value }
    });
  };

  const handleFieldOnChangeShipping = (value: string, name: string) => {
    if (name === "method" && (value === "air" || value === "ground"))
      return setForm({ ...form, shipping: { ...form.shipping, method: value } });

    setForm({
      ...form,
      shipping: { ...form.shipping, [name]: value }
    });
  };

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-30 w-full bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">Checkout</h1>
          <div className="w-6" />
        </div>
        <ul className="sticky top-11 z-50 flex w-full items-center border-b bg-white">
          <li
            className={`w-full ${activeTap === "shipping" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
          >
            <a className="flex justify-center py-2" onClick={() => setActiveTap("shipping")}>
              {t("checkout.shipping")}
            </a>
          </li>
          <li className={`w-full ${activeTap === "billing" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}>
            <a className="flex justify-center py-2" onClick={() => setActiveTap("billing")}>
              {t("checkout.billing")}
            </a>
          </li>
          <li className={`w-full ${activeTap === "summary" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}>
            <a className="flex justify-center py-2" onClick={() => setActiveTap("summary")}>
              {t("checkout.products")}
            </a>
          </li>
        </ul>
      </div>
      <div className="sticky top-[60px] z-30 hidden w-full justify-between border-b bg-white pt-4 md:flex">
        <ul className="flex items-center">
          <li
            className={`border-s border-t px-6 ${activeTap === "shipping" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
          >
            <a className="flex justify-center py-2" onClick={() => setActiveTap("shipping")}>
              {t("checkout.shipping")}
            </a>
          </li>
          <li
            className={`border-s border-t px-6 ${activeTap === "billing" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
          >
            <a className="flex justify-center py-2" onClick={() => setActiveTap("billing")}>
              {t("checkout.billing")}
            </a>
          </li>
          <li
            className={`border-x border-t px-6 ${activeTap === "summary" ? "-mb-0.5 border-b-2 border-b-black" : "text-strongGray"}`}
          >
            <a className="flex justify-center py-2" onClick={() => setActiveTap("summary")}>
              {t("checkout.products")}
            </a>
          </li>
        </ul>
        <Button className="text-nowrap bg-primary text-white">
          <div className="flex gap-6">
            <div>
              {t("checkout.placeOrder")}({shoppingCartProducts.length})
            </div>
            <div>{checkoutQuery.data?.total}$</div>
          </div>
        </Button>
      </div>
      <div className="mt-10 p-4 md:mt-0 md:p-0 md:py-4">
        {activeTap === "shipping" && (
          <ShippingForm addresses={userAddresses} shipping={form.shipping} onChange={handleFieldOnChangeShipping} />
        )}
        {activeTap === "billing" && (
          <BillingForm addresses={userAddresses} billing={form.billing} onChange={handleFieldOnChangeBilling} />
        )}
        {activeTap === "summary" &&
          shoppingCartProducts.map((item) => (
            <CartItem
              attributes={item.attributes}
              key={item.product._id}
              product={item.product}
              quantity={item.quantity}
            />
          ))}
      </div>
      <div className="fixed bottom-0 start-0 z-30 w-full border border-x-0 bg-white px-6 py-4 md:start-[280px] md:hidden md:w-[calc(100%-280px)]">
        <Button className="w-full bg-primary text-white" onClick={() => placeOrderMutation.mutate()}>
          <div className="flex w-full justify-between">
            {t("checkout.placeOrder")}({shoppingCartProducts.length})<div>{checkoutQuery.data?.total}$</div>
          </div>
        </Button>
      </div>
    </>
  );
}
