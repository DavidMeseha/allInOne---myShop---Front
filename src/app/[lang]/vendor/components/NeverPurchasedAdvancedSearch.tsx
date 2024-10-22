"use client";

import { useGeneralStore } from "@/stores/generalStore";
import React from "react";
import OverlayLayout from "@/components/overlays/OverlayLayout";
import Dropdown from "@/components/DropDown";
import Button from "@/components/Button";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "@/context/Translation";

type Props = {
  onChange: (name: string, value: any) => void;
  confirm: () => void;
};

export function NeverPurchasedAdvancedSearchOverlay({ onChange, confirm }: Props) {
  const { setIsAdvancedSearchOpen } = useGeneralStore();
  const { t } = useTranslation();
  return (
    <OverlayLayout className="max-h-screen overflow-auto" close={() => setIsAdvancedSearchOpen(false)}>
      <div className="mb-4 flex justify-between text-2xl font-bold">
        {t("vendor.advancedSearch")}
        <div className="w-3/12">
          <button
            className="float-right w-fit rounded-full bg-gray-100 p-1.5"
            onClick={() => setIsAdvancedSearchOpen(false)}
          >
            <FiArrowRight size="18" />
          </button>
        </div>
      </div>
      <NeverPurchasedAdvancedSearch confirm={confirm} onChange={onChange} />
    </OverlayLayout>
  );
}

export function NeverPurchasedAdvancedSearch({ onChange, confirm }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Dropdown
        defaultValue=""
        label={t("vendor.published")}
        name="published"
        options={[]}
        onChange={(e) => onChange(e.target.name, e.target.value)}
      />
      <Button className="mb-4 w-full bg-primary text-white md:w-auto" onClick={confirm}>
        Search
      </Button>
    </>
  );
}
