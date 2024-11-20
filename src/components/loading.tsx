import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

export default function Loading() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-2">
      <BiLoaderCircle className="animate-spin fill-primary" size={35} />
    </div>
  );
}
