"use client";

import Image from "next/image";
import { LocalLink } from "@/components/LocalizedNavigation";

export default function NotFound() {
  return (
    <div className="mt-28 flex flex-col items-center justify-center">
      <Image
        alt="product not found"
        className="object-contain contrast-0 filter"
        height={400}
        src="/images/product-not-found.png"
        width={400}
      />
      <h1 className="text-4xl font-bold text-strongGray">Product Not Found</h1>
      <LocalLink className="text-primary hover:underline" href="/">
        Go Home {" >"}
      </LocalLink>
    </div>
  );
}
