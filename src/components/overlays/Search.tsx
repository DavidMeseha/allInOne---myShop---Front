"use client";

import { useGeneralStore } from "@/stores/generalStore";
import React from "react";
import { RiCloseLine } from "react-icons/ri";

export default function Search() {
  const { setSearch, setIsSearchOpen, search } = useGeneralStore();
  function close() {
    setIsSearchOpen(false);
    setSearch("");
  }
  return (
    <div className="fixed start-0 top-0 z-[60] flex w-full justify-between border-b border-b-lightGray bg-white p-2">
      <div className="w-5/6">
        <input
          className="w-full rounded-full border-strongGray p-1 ps-4 focus:border-secondary focus:ring-secondary"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex w-1/6 justify-end">
        <div className="inline-block cursor-pointer rounded-full bg-lightGray p-1" onClick={close}>
          <RiCloseLine size={25} />
        </div>
      </div>
    </div>
  );
}
