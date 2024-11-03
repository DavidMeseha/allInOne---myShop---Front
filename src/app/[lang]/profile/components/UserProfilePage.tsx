"use client";

import { BsCartFill } from "react-icons/bs";
import { useEffect } from "react";
import { useUser } from "@/context/user";
import { useUserStore } from "@/stores/userStore";
import { useGeneralStore } from "@/stores/generalStore";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import BackArrow from "@/components/BackArrow";
import { useTranslation } from "@/context/Translation";
import { BiLoaderCircle } from "react-icons/bi";
import UserProfileDisplay from "./UserProfileDisplay";

export default function UserProfilePage() {
  const { t, lang } = useTranslation();
  const { user } = useUser();
  const { cartProducts } = useUserStore();
  const { setIsLoginOpen } = useGeneralStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.isRegistered) setIsLoginOpen(true);
  }, []);

  if (!user)
    return (
      <div className="flex justify-center py-4">
        <BiLoaderCircle className="animate-spin fill-primary" size={30} />
      </div>
    );

  if (user?.isRegistered) return <UserProfileDisplay />;

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-20 w-full border bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">{t("profile.yourProfile")}</h1>
          <Link className="relative end-2" href={`/${lang}/cart`}>
            <div className="absolute -end-2 -top-1 flex h-4 w-4 justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {cartProducts.length}
            </div>
            <BsCartFill size={20} />
          </Link>
        </div>
      </div>
      <div className="mt-44 flex justify-center">
        <p className="text-lg font-semibold">
          {t("profile.youNeedTo") + " "}
          <span className="text-primary">
            <button onClick={() => setIsLoginOpen(true)}>{t("profile.signUp")}</button>
          </span>
        </p>
      </div>
    </>
  );
}
