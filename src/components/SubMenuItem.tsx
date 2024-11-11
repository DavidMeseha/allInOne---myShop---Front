import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";

type Props = {
  item: {
    name: string;
    sup?: { name: string; to: string }[];
    Icon: React.ReactNode;
    IconActive: React.ReactNode;
    to?: string;
  };
};

export default function SubMenuItem({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        className="flex w-full justify-between rounded-md p-2 text-lg font-semibold hover:bg-lightGray"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {item.Icon}
          {item.name}
        </div>
        <RiArrowDropDownLine size={25} />
      </button>
      <ul
        data-testid="sub-items"
        className={`${isOpen ? "max-h-52" : "max-h-0"} overflow-hidden transition-all duration-500`}
      >
        {item.sup?.map((supItem, index) => (
          <li className="my-2 w-10/12 md:w-full" key={index}>
            <Link
              href={supItem.to}
              className={`flex w-full items-center gap-1 rounded-md p-2 ps-6 text-lg font-semibold hover:bg-lightGray ${
                pathname === supItem.to ? "bg-lightGray text-primary" : ""
              }`}
            >
              <RiArrowDropLeftLine data-testid="sub-menu-left-icon" className="hidden rtl:block" size={20} />
              <RiArrowDropRightLine data-testid="sub-menu-right-icon" className="rtl:hidden" size={20} />
              {supItem.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
