"usee client";

import Link, { LinkProps } from "next/link";
import { useTranslation } from "@/context/Translation"; // Adjust the import based on your translation context
import React from "react";
import { usePathname } from "next/navigation";

interface Props extends LinkProps {
  children: React.ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
}

export function useLocalPathname() {
  const pathname = usePathname();
  const params = [...pathname.split("/")];
  params.shift();
  const lang = params.shift();
  return { lang, pathname: "/" + params.join("/") };
}

export function LocalLink({ href, children, ...props }: Props) {
  const { lang } = useTranslation();
  return (
    <Link href={`/${lang}${href}`} {...props}>
      {children}
    </Link>
  );
}
