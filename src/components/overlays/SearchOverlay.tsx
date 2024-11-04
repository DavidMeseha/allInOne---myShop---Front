import React, { useEffect, useRef, useState } from "react";
import Input from "../Input";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import Checkbox from "../Checkbox";
import { ICategory, IFullProduct, ITag, IVendor } from "@/types";
import Image from "next/image";
import { RiCloseLine } from "react-icons/ri";
import Button from "../Button";
import { useGeneralStore } from "@/stores/generalStore";
import { Variants, motion } from "framer-motion";

type SearchResponse = {
  item: IFullProduct | IVendor | ITag | ICategory;
  type: "product" | "category" | "vendor" | "tag";
}[];

const bgVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const popupVariants: Variants = {
  hidden: { translateY: 40 },
  visible: { translateY: 0, transition: { duration: 0.15 } },
  exit: { translateY: 40, transition: { duration: 0.2 } }
};

export default function SearchOverlay() {
  const { setIsSearchOpen, isSearchOpen } = useGeneralStore();
  const [searchText, setSearchText] = useState("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [options, setOptions] = useState({
    categories: false,
    vendors: false,
    tags: false,
    products: false
  });
  const timeoutRef = useRef<number>();

  useEffect(() => {
    let timeoutId: number;
    if (!isSearchOpen) {
      timeoutId = window.setTimeout(() => setIsAnimating(false), 200);
    } else {
      setIsAnimating(true);
    }

    return () => clearTimeout(timeoutId);
  }, [isSearchOpen]);

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
    enabled: searchText.length > 0 && isSearchOpen
  });

  const items = searchQuery.data?.data ?? [];

  return (
    <motion.div initial="hidden" animate="visible" exit="exit">
      <motion.div
        className="fixed z-40 h-screen w-full bg-lightGray bg-opacity-90 backdrop-blur-lg transition-opacity"
        variants={bgVariants}
      >
        <motion.div variants={popupVariants} className="mx-auto mt-4 max-w-[1200px] px-4 md:mt-14 md:px-28">
          <div className="relative">
            <Input
              className="rounded-full border-none bg-white p-4 pe-12 drop-shadow-md"
              label=""
              placeholder="Find: vendor, product, category, tag"
              type="text"
              onChange={(e) => handleChange(e.target.value)}
            />
            <Button className="absolute end-0 top-0 py-4 text-strongGray" onClick={() => setIsSearchOpen(false)}>
              <RiCloseLine size="30" />
            </Button>
          </div>
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
