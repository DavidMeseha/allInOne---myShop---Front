"use client";

import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  const { lang } = useTranslation();
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
      <Link className="text-primary hover:underline" href={`/${lang}`}>
        Go Home {" >"}
      </Link>
    </div>
  );
}
