import FormDropdownInput from "@/components/FormDropdownInput";
import FormTextInput from "@/components/FormTextInput";
import React from "react";
import { useTranslation } from "@/context/Translation";
import { IAddress } from "@/types";
import { useGeneralStore } from "@/stores/generalStore";
import Button from "@/components/Button";

interface IBillingForm {
  billingAddressId: string;
  method: "cod" | "card";
  cardInfo: {
    code: string;
    exp: string;
    holder: string;
  };
}

export default function BillingForm({
  onChange,
  addresses,
  billing
}: {
  onChange: (value: string, name: string) => void;
  billing: IBillingForm;
  addresses: IAddress[];
}) {
  const { t } = useTranslation();
  const { setIsAddAddressOpen } = useGeneralStore();

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="grow">
          <FormDropdownInput
            label={t("address")}
            name="billingAddressId"
            options={addresses.map((address) => ({ name: address.address, value: address._id }))}
            value={billing.billingAddressId}
            onUpdate={onChange}
          />
        </div>
        <Button className="bg-primary text-white" onClick={() => setIsAddAddressOpen(true)}>
          Add New
        </Button>
      </div>
      <div className="px-6 pb-1">
        <div className="flex items-center gap-6">
          <p className="mb-2 font-semibold">Billing Method</p>
          <div className="mb-4 flex items-center">
            <input
              checked={billing.method === "cod"}
              className="h-4 w-4 border-gray-300 bg-gray-100"
              id="cod"
              name="method"
              type="radio"
              value="cod"
              onChange={(e) => onChange(e.target.value, e.target.name)}
            />
            <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500" htmlFor="cod">
              {t("checkout.cod")}
            </label>
          </div>
          <div className="mb-4 flex items-center">
            <input
              checked={billing.method === "card"}
              className="h-4 w-4 border-gray-300 bg-gray-100"
              id="card"
              name="method"
              type="radio"
              value="card"
              onChange={(e) => onChange(e.target.value, e.target.name)}
            />
            <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500" htmlFor="card">
              {t("checkout.cridetCard")}
            </label>
          </div>
        </div>
      </div>
      {billing.method === "card" && (
        <>
          <div className="mb-4 mt-4 text-center text-lg font-bold">{t("checkout.cardDetails")}</div>
          <FormTextInput
            error={false}
            inputType="text"
            name="holder"
            placeholder={t("checkout.holderName")}
            value={billing.cardInfo.holder}
            onUpdate={onChange}
          />

          <FormTextInput
            error={false}
            inputType="text"
            name="exp"
            placeholder={t("checkout.expiry")}
            value={billing.cardInfo.exp}
            onUpdate={onChange}
          />

          <FormTextInput
            error={false}
            inputType="password"
            name="code"
            placeholder={t("checkout.passCode")}
            value={billing.cardInfo.code}
            onUpdate={onChange}
          />
        </>
      )}
    </>
  );
}
