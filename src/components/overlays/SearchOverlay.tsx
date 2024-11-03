import React, { useRef, useState } from "react";
import Input from "../Input";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import Checkbox from "../Checkbox";
import { ICategory, IFullProduct, ITag, IVendor } from "@/types";
import Image from "next/image";

type SearchResponse = {
  item: IFullProduct | IVendor | ITag | ICategory;
  type: "product" | "category" | "vendor" | "tag";
}[];

export default function SearchOverlay() {
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState({
    categories: false,
    vendors: false,
    tags: false,
    products: false
  });
  const timeoutRef = useRef<number>();

  const handleChange = (value: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setSearchText(value);
    }, 1000);
  };

  const searchQuery = useQuery({
    queryKey: ["find", searchText, options],
    queryFn: () =>
      axiosInstanceNew.post<SearchResponse>("/api/common/find", {
        ...options,
        searchText
      }),
    enabled: searchText.length > 0, // Only run the query if searchTerm is not empty
    staleTime: 5000 // Cache results for 5 seconds
  });

  const items = searchQuery.data?.data ?? [];

  return (
    <div className="fixed z-40 h-screen w-full bg-lightGray bg-opacity-90 backdrop-blur-lg">
      <div className="mx-auto mt-4 max-w-[1200px] px-4 md:mt-14 md:px-28">
        <Input
          className="rounded-full border-none bg-white p-4 drop-shadow-md"
          label=""
          placeholder="Find: vendor, product, category, tag"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <div className="flex flex-wrap text-xs">
          <Checkbox label="Vendors" onChange={(e) => setOptions({ ...options, vendors: e.target.checked })} />
          <Checkbox label="Categories" onChange={(e) => setOptions({ ...options, categories: e.target.checked })} />
          <Checkbox label="Products" onChange={(e) => setOptions({ ...options, products: e.target.checked })} />
          <Checkbox label="Tags" onChange={(e) => setOptions({ ...options, tags: e.target.checked })} />
        </div>
        <div>
          {items.map((item) => (
            <div className="flex gap-2 p-4" key={item.item._id}>
              {"pictures" in item.item ? (
                <div>
                  <Image
                    alt={item.item.name}
                    className="rounded-md object-cover"
                    height={40}
                    src={item.item.pictures[0].imageUrl}
                    width={40}
                  />
                </div>
              ) : null}
              {"imageUrl" in item.item ? (
                <div>
                  <Image
                    alt={item.item.name}
                    className="rounded-md object-cover"
                    height={40}
                    src={item.item.imageUrl}
                    width={40}
                  />
                </div>
              ) : null}
              <div>
                <h3 className="font-semibold">{item.item.name}</h3>
                <p className="text-sm text-strongGray">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
