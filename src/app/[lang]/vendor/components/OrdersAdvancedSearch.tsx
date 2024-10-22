"use client";

import { useGeneralStore } from "@/stores/generalStore";
import React from "react";
import OverlayLayout from "@/components/overlays/OverlayLayout";
import Input from "@/components/Input";
import Dropdown from "@/components/DropDown";
import Button from "@/components/Button";
import MultiselectDropdown from "@/components/MultiSelectDropdown";
import { useTranslation } from "@/context/Translation";

type Props = {
  onChange: (name: string, value: any) => void;
  confirm: () => void;
};

export function OrdersAdvancedSearchOverlay({ onChange, confirm }: Props) {
  const { setIsAdvancedSearchOpen } = useGeneralStore();
  const { t } = useTranslation();
  return (
    <OverlayLayout className="max-h-screen overflow-auto" close={() => setIsAdvancedSearchOpen(false)}>
      <div className="mb-4 text-2xl font-bold">{t("vendor.advancedSearch")}</div>
      <OrdersAdvancedSearch confirm={confirm} onChange={onChange} />
    </OverlayLayout>
  );
}

export default function OrdersAdvancedSearch({ onChange, confirm }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="grid grid-cols-1 items-center justify-center gap-x-4 md:grid-cols-2">
        <Input
          label={t("vendor.startDate")}
          name="startDate"
          type="date"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Input
          label={t("vendor.endDate")}
          name="endDate"
          type="date"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue=""
          label={t("vendor.warehouse")}
          name="warehouse"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Input
          label={t("vendor.productName")}
          name="productName"
          type="text"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <MultiselectDropdown
          labelledBy={t("vendor.paymentMethods")}
          options={[
            { value: "pending", label: "Pending" },
            { value: "authorized", label: "Authorized" },
            { value: "paid", label: "Paid" },
            { value: "partially refunded", label: "Partially Refunded" },
            { value: "refunded", label: "Refunded" },
            { value: "voided", label: "Voided" }
          ]}
          onSelectChange={(selected) => onChange("paymentStatuses", selected)}
        />
        <Input
          label={t("vendor.billingPhone")}
          name="billingPhone"
          type="text"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Input
          label={t("vendor.billingEmail")}
          name="billingEmail"
          type="text"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Input
          label={t("vendor.billingLastName")}
          name="billingLastName"
          type="text"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue=""
          label={t("vendor.billingCountry")}
          name="billingCountry"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Input
          label={t("vendor.orderNotes")}
          name="orderNotes"
          type="text"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
      </div>
      <Button className="mb-4 w-full bg-primary text-white md:w-auto" onClick={confirm}>
        {t("vendor.find")}
      </Button>
    </>
  );
}
