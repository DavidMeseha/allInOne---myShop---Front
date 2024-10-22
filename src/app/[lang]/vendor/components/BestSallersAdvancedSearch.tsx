"use client";

import { useGeneralStore } from "@/stores/generalStore";
import React from "react";
import OverlayLayout from "@/components/overlays/OverlayLayout";
import Input from "@/components/Input";
import Dropdown from "@/components/DropDown";
import Button from "@/components/Button";
import { useTranslation } from "@/context/Translation";

type Props = {
  onChange: (name: string, value: any) => void;
  confirm: () => void;
};

export function BestSallersAdvancedSearchOverlay({ onChange, confirm }: Props) {
  const { setIsAdvancedSearchOpen } = useGeneralStore();
  const { t } = useTranslation();
  return (
    <OverlayLayout className="max-h-screen overflow-auto" close={() => setIsAdvancedSearchOpen(false)}>
      <div className="mb-4 flex justify-between text-2xl font-bold">{t("vendor.advancedSearch")}</div>
      <BestSallersAdvancedSearch confirm={confirm} onChange={onChange} />
    </OverlayLayout>
  );
}

export function BestSallersAdvancedSearch({ onChange, confirm }: Props) {
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
          label={t("vendor.category")}
          name="category"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue=""
          label="Manufacturer"
          name="manufacturer"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue="all"
          label={t("vendor.paymentStatus")}
          name="paymentStatus"
          options={[
            { value: "all", name: "All" },
            { value: "pending", name: "Pending" },
            { value: "authorized", name: "Authorized" },
            { value: "paid", name: "Paid" },
            { value: "partially refunded", name: "Partially Refunded" },
            { value: "refunded", name: "Refunded" },
            { value: "voided", name: "Voided" }
          ]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue=""
          label={t("vendor.billingCountry")}
          name="billingCountry"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
      </div>
      <Button className="mb-4 w-full bg-primary text-white md:w-auto" onClick={confirm}>
        {t("vendor.find")}
      </Button>
    </>
  );
}
