"use client";

import React, { useState } from "react";
import { useGeneralStore } from "@/stores/generalStore";
import VendorProductItem from "../../components/VendorProductItem";
import { LowstockAdvancedSearch, LowstockAdvancedSearchOverlay } from "../../components/LowstockAdvancedSearch";
import { Product } from "@/types";

type AdvancedSearch = {
  published: string;
};

const initialAdvancedSearch: AdvancedSearch = {
  published: ""
};

export default function LowstockPage() {
  const { isAdvancedSearchOpen, setIsAdvancedSearchOpen } = useGeneralStore();
  const [searchOptions, setSearchOptions] = useState<AdvancedSearch>(initialAdvancedSearch);

  const searchChangeHandle = (name: string, value: any) => {
    setSearchOptions({ ...searchOptions, [name]: value });
  };

  const confirmSearch = () => {
    setIsAdvancedSearchOpen(false);
    console.log(searchOptions);
  };

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

  return (
    <>
      <div className="hidden md:block">
        <LowstockAdvancedSearch confirm={confirmSearch} onChange={searchChangeHandle} />
      </div>
      <ul className="mt-2 select-none">
        {allProducts.map((product) => (
          <VendorProductItem canSelect={false} isBestSellers key={product.id} product={product} />
        ))}
      </ul>
      {isAdvancedSearchOpen ? (
        <LowstockAdvancedSearchOverlay confirm={confirmSearch} onChange={searchChangeHandle} />
      ) : null}
    </>
  );
}
