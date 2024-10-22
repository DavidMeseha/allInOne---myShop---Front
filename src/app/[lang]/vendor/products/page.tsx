"use client";

// import { useUserStore } from "@/stores/products";
import React, { useState } from "react";
import { Product } from "@/types";
import { useGeneralStore } from "@/stores/generalStore";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import _ from "lodash";
import DropdownButton from "@/components/DropdownButton";
import { ProductsAdvancedSearchOverlay, ProductsAdvancedSearch } from "../components/ProductsAdvancedSearch";
import VendorProductItem from "../components/VendorProductItem";
import { useTranslation } from "@/context/Translation";

type AdvancedSearch = {
  name: string;
  category: string;
  inSubcategories: boolean;
  type: string;
  published: boolean | "all";
  warehouse: string;
  manufacturer: string;
};

const initialAdvancedSearch: AdvancedSearch = {
  name: "",
  category: "",
  inSubcategories: false,
  type: "",
  published: "all",
  warehouse: "",
  manufacturer: ""
};

export default function YourProductsPage() {
  const { isAdvancedSearchOpen, setIsAdvancedSearchOpen } = useGeneralStore();
  const allProducts: Product[] = [
    {
      vendor: {
        description: "",
        followed: false,
        followers_count: 0,
        id: 2,
        image: { src: "/images/placeholder.png" },
        name: "Vendor1",
        products_count: 0,
        se_name: "v1"
      },
      name: "Product",
      price: 300,
      published: true,
      short_description: "",
      sku: "sku",
      stock_quantity: 5000,
      tags: [{ id: 0, created_on_utc: "", name: "com", product_id: 1, se_name: "com" }],
      description: "Long String",
      created_on_utc: "",
      id: 3,
      images: [{ src: "/images/placeholder.png", id: 0 }],
      counters: [{ count: 0, name: "Like", is_active: true, id: 0 }],
      attributes: [
        {
          attribute_control_type_name: "Checkboxes",
          attribute_values: [
            { id: 1, name: "X" },
            { id: 2, name: "Y" },
            { id: 3, name: "Z" }
          ],
          id: 0,
          product_attribute_name: "attr5"
        },
        {
          attribute_control_type_name: "ColorSquares",
          attribute_values: [
            { id: 4, name: "redish", color_squares_rgb: "#523" },
            { id: 5, name: "Y", color_squares_rgb: "#863" },
            { id: 6, name: "Z", color_squares_rgb: "#1f9" }
          ],
          id: 1,
          product_attribute_name: "attr2"
        }
      ]
    },
    {
      vendor: {
        description: "",
        followed: false,
        followers_count: 0,
        id: 2,
        image: { src: "/images/placeholder.png" },
        name: "Vendor1",
        products_count: 0,
        se_name: "v1"
      },
      name: "Product",
      price: 300,
      published: true,
      short_description: "",
      sku: "sku",
      stock_quantity: 5000,
      tags: [{ id: 0, created_on_utc: "", name: "com", product_id: 1, se_name: "com" }],
      description: "Long String",
      created_on_utc: "",
      id: 2,
      images: [{ src: "/images/placeholder.png", id: 0 }],
      counters: [{ count: 0, name: "Like", is_active: true, id: 0 }],
      attributes: [
        {
          attribute_control_type_name: "Checkboxes",
          attribute_values: [
            { id: 1, name: "X" },
            { id: 2, name: "Y" },
            { id: 3, name: "Z" }
          ],
          id: 0,
          product_attribute_name: "attr5"
        },
        {
          attribute_control_type_name: "ColorSquares",
          attribute_values: [
            { id: 4, name: "redish", color_squares_rgb: "#523" },
            { id: 5, name: "Y", color_squares_rgb: "#863" },
            { id: 6, name: "Z", color_squares_rgb: "#1f9" }
          ],
          id: 1,
          product_attribute_name: "attr2"
        }
      ]
    }
  ];
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchOptions, setSearchOptions] = useState<AdvancedSearch>(initialAdvancedSearch);

  const productSelectChange = (isChecked: boolean, product: Product) => {
    const tempSelected = [...selectedProducts];
    if (isChecked) {
      tempSelected.push({ ...product });
    } else {
      tempSelected.splice(
        tempSelected.findIndex((prod) => product.id === prod.id),
        1
      );
    }
    setSelectedProducts([...tempSelected]);
  };

  const searchChangeHandle = (name: string, value: any) => {
    setSearchOptions({ ...searchOptions, [name]: value });
  };

  const confirmSearch = () => {
    setIsAdvancedSearchOpen(false);
    console.log(searchOptions);
  };

  const selectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) setSelectedProducts([...allProducts]);
    else setSelectedProducts([]);
  };

  const handleExport = (selected: string) => {
    if (selected === "XML(All Found)") return;
    if (selected === "XML(Selected)") return;
    if (selected === "Excel(All Found)") return;
    if (selected === "Excel(Selected)") return;
  };

  return (
    <div className="px-4">
      <div className="hidden md:block">
        <ProductsAdvancedSearch confirm={confirmSearch} onChange={searchChangeHandle} />
      </div>
      <div className="sticky top-11 z-20 bg-white py-4 md:top-14">
        <div className="flex gap-2">
          <input
            className="w-full rounded-md border-strongGray focus:border-primary focus:ring-primary"
            placeholder={t("vendor.enterProductSKU")}
            type="text"
          />
          <button className="rounded-md bg-primary px-4 py-2 text-white">{t("go")}</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-white">
          <Button className="bg-cyan-700">{t("vendor.addNew")}</Button>
          <Button className="bg-blue-700">{t("vendor.downloadCatalogPdf")}</Button>
          <DropdownButton
            className="bg-green-700"
            options={["XML(All Found)", "XML(Selected)", "Excel(All Found)", "Excel(Selected)"]}
            onSelectItem={handleExport}
          >
            {t("vendor.export")}
          </DropdownButton>
          <Button className="bg-purple-700">{t("vendor.import")}</Button>
          <Button className="bg-red-700">{t("vendor.deleteSelected")}</Button>
          <Checkbox
            checked={_.isEqual(_.sortBy(allProducts, "id"), _.sortBy(selectedProducts, "id"))}
            className="cursor-pointer select-none rounded-sm bg-gray-700"
            label={t("vendor.selectAll")}
            onChange={selectAll}
          />
        </div>
      </div>
      <ul className="mt-2 select-none">
        {allProducts.map((product) => (
          <VendorProductItem
            canSelect
            isSelected={!!selectedProducts.find((prod) => product.id === prod.id)}
            key={product.id}
            product={product}
            selectProduct={(e) => productSelectChange(e.target.checked, product)}
          />
        ))}
      </ul>
      {isAdvancedSearchOpen ? (
        <ProductsAdvancedSearchOverlay confirm={confirmSearch} onChange={searchChangeHandle} />
      ) : null}
    </div>
  );
}
