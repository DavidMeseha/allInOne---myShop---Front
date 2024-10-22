"use client";

import React from "react";
import OverlayLayout from "@/components/overlays/OverlayLayout";
import { useGeneralStore } from "@/stores/generalStore";
import Input from "@/components/Input";
import Dropdown from "@/components/DropDown";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import { useTranslation } from "@/context/Translation";

type Props = {
  onChange: (name: string, value: any) => void;
  confirm: () => void;
};

export function ProductsAdvancedSearchOverlay({ onChange, confirm }: Props) {
  const { setIsAdvancedSearchOpen } = useGeneralStore();
  const { t } = useTranslation();
  return (
    <OverlayLayout className="max-h-screen overflow-auto" close={() => setIsAdvancedSearchOpen(false)}>
      <div className="mb-4 text-2xl font-bold">{t("vendor.advancedSearch")}</div>
      <ProductsAdvancedSearch confirm={confirm} onChange={onChange} />
    </OverlayLayout>
  );
}

export function ProductsAdvancedSearch({ onChange, confirm }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className="grid grid-cols-1 items-center justify-center gap-x-4 md:grid-cols-2">
        <Input
          autoComplete="off"
          label={t("vendor.productName")}
          name="name"
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue="all"
          label={t("vendor.category")}
          name="category"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue="all"
          label="Manufacturer"
          name="manufacturer"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue="all"
          label={t("vendor.warehouse")}
          name="warehouse"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue="all"
          label={t("vendor.productType")}
          name="type"
          options={[]}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <Dropdown
          defaultValue="all"
          label={t("vendor.published")}
          name="published"
          options={[
            { name: "all", value: "all" },
            { name: "published", value: "published" },
            { name: "unpublished", value: "unpublished" }
          ]}
          onChange={(e) =>
            onChange(e.target.name, e.target.value === "published" ? true : e.target.value === "all" ? "all" : false)
          }
        />
        <Checkbox
          className="mb-4"
          label={t("vendor.searchSubcategories")}
          name="inSubcategories"
          onChange={(e) => onChange(e.target.name, e.target.checked)}
        />
      </div>
      <Button className="mb-4 w-full bg-primary text-white md:w-auto" onClick={confirm}>
        {t("vendor.find")}
      </Button>
    </>
  );
}
