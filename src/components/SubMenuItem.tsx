import Link from "next/link";
import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

type Props = {
  item: { name: string; sup: { name: string; to: string }[] };
};

export default function SubMenuItem({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="flex w-full justify-between rounded-md p-2 text-lg font-semibold hover:bg-lightGray"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.name}
        <RiArrowDropDownLine size={25} />
      </button>
      <ul className={`${isOpen ? "max-h-52" : "max-h-0"} overflow-hidden transition-all duration-500`}>
        {item.sup?.map((supItem, index) => (
          <li className="w-10/12 md:w-full" key={index}>
            <Link
              className="block w-full rounded-md p-2 ps-6 text-lg font-semibold hover:bg-lightGray"
              href={supItem.to}
            >
              {supItem.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
