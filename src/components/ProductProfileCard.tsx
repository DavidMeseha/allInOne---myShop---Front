import Link from "next/link";
import Image from "next/image";
import { IFullProduct } from "@/types";
import { useTranslation } from "@/context/Translation";

export default function ProductProfileCard({ product }: { product: IFullProduct }) {
  const { lang } = useTranslation();

  return (
    <>
      <div className="relative cursor-pointer overflow-clip rounded-md brightness-90 hover:brightness-[1.01]">
        <Link href={`/${lang}/product/${product._id}`}>
          <Image
            alt={product.name}
            className="aspect-[3/4] object-cover"
            height={500}
            src={product.pictures[0].imageUrl}
            style={{ width: "auto", height: "auto" }}
            width={500}
          />
        </Link>
        <div className="absolute bottom-0 end-0 start-0 overflow-clip text-ellipsis whitespace-nowrap bg-opacity-30 bg-gradient-to-b from-transparent to-[#000000b6] p-4 text-white">
          {product.name}
        </div>
      </div>
    </>
  );
}
