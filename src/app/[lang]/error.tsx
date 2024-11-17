"use client";
import Button from "@/components/Button";
import Image from "next/image";
import { FaRedo } from "react-icons/fa";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mt-28 flex flex-col items-center justify-center">
      <Image
        alt="product not found"
        className="object-contain contrast-0 filter"
        height={400}
        src={"/images/product-not-found.png"}
        width={400}
      />
      <h1 className="text-4xl font-bold text-strongGray">{error.message}</h1>
      <Button className="mt-4 bg-primary text-white hover:underline" onClick={() => reset()}>
        <div className="flex items-center gap-2">
          Retry <FaRedo size={13} />
        </div>
      </Button>
    </div>
  );
}
