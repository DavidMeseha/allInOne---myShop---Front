import Image from "next/image";
import Link from "next/link";

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
      <h1 className="text-4xl font-bold text-strongGray">404: Resource Not Found</h1>
      <Link className="mt-4 text-primary hover:underline" href="/">
        Go Home {" >"}
      </Link>
    </div>
  );
}
