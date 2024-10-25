"use client";

import { useState } from "react";
import { IAddress, IFullProduct, IProductAttribute } from "@/types";
import CartItem from "../../../components/CartItem";
import { useRouter } from "next-nprogress-bar";
import BackArrow from "@/components/BackArrow";
import { useTranslation } from "@/context/Translation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import FormDropdownInput from "@/components/FormDropdownInput";
import { useGeneralStore } from "@/stores/generalStore";
import RadioGroup from "@/components/RadioGroup";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface ICheckoutForm {
  shippingAddressId: string;
  billingMethod: string;
  billingStatus: string;
}

const initialCheckoutForm: ICheckoutForm = {
  billingMethod: "cod",
  billingStatus: "cod",
  shippingAddressId: ""
};

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const [activeTap, setActiveTap] = useState<"shipping" | "billing" | "summary">("shipping");
  const [form, setForm] = useState(initialCheckoutForm);
  const { setIsAddAddressOpen } = useGeneralStore();
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

  const preperPaymentMutation = useMutation({
    mutationKey: ["preperPayment"],
    mutationFn: () => axiosInstanceNew.get<{ paymentSecret: string }>("/api/user/preperPayment")
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
          setForm({ ...form, shippingAddressId: res.data.addresses[0]._id });
          return res.data;
        })
  });

  const shoppingCartProducts = checkoutQuery.data?.cartItems ?? [];
  const addresses = checkoutQuery.data?.addresses ?? [];

  const handleFieldOnChange = (value: string, name: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (form.billingMethod === "cod") return placeOrderMutation.mutate();

    if (!elements || !stripe) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // Create payment intent on the server
    await preperPaymentMutation.mutateAsync();
    if (!preperPaymentMutation.data) return;
    console.log(preperPaymentMutation.data.data);

    const { paymentSecret } = preperPaymentMutation.data.data;

    // Confirm the payment with the card details
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(paymentSecret, {
      payment_method: {
        card: cardElement
      }
    });

    console.log(stripeError);
    console.log(paymentIntent);
    if (stripeError) return;
    else placeOrderMutation.mutate();
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
          <>
            <div className="flex items-start gap-4">
              <div className="grow">
                <FormDropdownInput
                  label=""
                  name="shippingAddressId"
                  options={addresses.map((address) => ({ name: address.address, value: address._id }))}
                  value={form.shippingAddressId}
                  onUpdate={handleFieldOnChange}
                />
              </div>
              <Button className="bg-primary text-white" onClick={() => setIsAddAddressOpen(true)}>
                Add New
              </Button>
            </div>
            <RadioGroup
              className="text-sm"
              title="Billing Method"
              value={form.billingMethod}
              options={[
                { name: "COD", value: "cod" },
                { name: "Cridet Card", value: "card" }
              ]}
              onChange={(value) => setForm({ ...form, billingMethod: value })}
            />
            {form.billingMethod === "card" ? (
              <CardElement className="mx-auto mt-9 w-auto max-w-[500] rounded-md border p-4" />
            ) : null}
          </>
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
        <Button
          className="w-full bg-primary text-white"
          isLoading={placeOrderMutation.isPending}
          onClick={handleSubmit}
        >
          <div className="flex w-full justify-between">
            {t("checkout.placeOrder")}({shoppingCartProducts.length})<div>{checkoutQuery.data?.total}$</div>
          </div>
        </Button>
      </div>
    </>
  );
}
