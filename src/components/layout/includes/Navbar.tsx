"use client";

import Link from "next/link";
// import { debounce } from "debounce";
import { usePathname } from "next/navigation";
import { BiSearch, BiUser } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { ChangeEvent, memo, useRef, useState } from "react";
import { useUser } from "@/context/user";
import { useGeneralStore } from "@/stores/generalStore";
import ClickRecognition from "@/hooks/useClickRecognition";
import Button from "@/components/Button";
import { useTranslation } from "../../../context/Translation";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import { IFullProduct } from "@/types";

function NavBar() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef(null);

  const [searchProducts, setSearchProducts] = useState<IFullProduct[]>([]);
  let [showMenu, setShowMenu] = useState<boolean>(false);
  const { t, lang } = useTranslation();
  const { setIsLoginOpen, setSearch, search } = useGeneralStore();

  // const handleSearch = debounce(async (event: { target: { value: string } }) => {
  //   if (event.target.value === "") return setSearchProducts([]);
  //   setSearchProducts(
  //     allProducts.filter((product) => product.name.toLowerCase().includes(event.target.value.toLowerCase()))
  //   );
  // }, 500);

  function HandleSearchOnChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    if (
      pathname !== `/${lang}/discover` &&
      pathname !== `/${lang}/discover/products` &&
      pathname !== `/${lang}/discover/vendors` &&
      pathname !== `/${lang}/discover/tags` &&
      pathname !== `/${lang}/vendor/products`
    ) {
      return;
    }
    // handleSearch(e);
  }

  const goTo = () => {
    if (!user || !user.isRegistered) return setIsLoginOpen(true);
    router.push(`/${lang}/upload`);
  };

  ClickRecognition(() => setSearchProducts([]), searchRef);

  console.log(user);

  return (
    <div className="fixed z-30 hidden h-[60px] w-full items-center border-b bg-white md:flex" id="TopNav">
      <div className={`mx-auto flex w-full items-center justify-between gap-6 px-4`}>
        <Link aria-label="to Home Page" href={`/${lang}`}>
          <Image
            alt="Tiktok"
            className="h-auto min-w-[115px] object-cover"
            height={115}
            priority
            src="/images/tiktok-logo.png"
            width={115}
          />
        </Link>

        <div
          className="relative hidden w-full max-w-[430px] items-center justify-end rounded-full bg-[#F1F1F2] p-1 md:flex"
          ref={searchRef}
        >
          <input
            className="m-0 my-2 w-full border-none bg-transparent p-0 ps-3 text-[15px] placeholder-[#838383] focus:ring-0"
            placeholder={t("search")}
            type="text"
            value={search}
            onChange={HandleSearchOnChange}
            onFocus={HandleSearchOnChange}
          />
          <div className="flex items-center border-s border-l-gray-300 px-3 py-1">
            <BiSearch color="#A1A2A7" size="22" />
          </div>

          {searchProducts.length > 0 ? (
            <div className="absolute left-0 top-12 z-20 h-auto max-h-96 w-full max-w-[910px] overflow-auto border bg-white">
              {searchProducts.map((product, index) => (
                <div key={index}>
                  <Link
                    className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-primary hover:text-white"
                    href={`/${lang}/product/${product?._id}`}
                  >
                    <div className="flex items-center">
                      <Image
                        alt={product.name}
                        className="w-10 rounded-md"
                        height={50}
                        src={product?.pictures[0].imageUrl}
                        width={50}
                      />
                      <div className="ml-2 truncate">{product?.name}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {user?.isVendor && (
            <Button className="flex items-center rounded-sm border hover:bg-gray-100" onClick={() => goTo()}>
              <AiOutlinePlus color="#000000" size="22" />
              <span className="px-2 text-[15px] font-medium">{t("upload")}</span>
            </Button>
          )}

          {!user || !user.isRegistered ? (
            <Button className="bg-primary text-white" onClick={() => setIsLoginOpen(true)}>
              <span className="mx-4 whitespace-nowrap text-[15px] font-medium">{t("login")}</span>
            </Button>
          ) : (
            <div className="flex items-center">
              <div className="relative">
                <button className="mt-1 rounded-full border border-gray-200" onClick={() => setShowMenu(!showMenu)}>
                  <Image
                    alt={user.firstName || ""}
                    className="h-[35px] w-[35px] rounded-full"
                    height={45}
                    src="/images/placeholder.png"
                    width={45}
                  />
                </button>

                {showMenu ? (
                  <div className="absolute end-0 top-12 w-[200px] rounded-lg border bg-white shadow-xl">
                    <button
                      className="flex w-full cursor-pointer items-center justify-start px-2 py-3 hover:bg-gray-100"
                      onClick={() => {
                        router.push(`/${lang}/profile/me`);
                        setShowMenu(false);
                      }}
                    >
                      <BiUser size="20" />
                      <span className="pl-2 text-sm font-semibold">{t("menu.profile")}</span>
                    </button>
                    <button
                      className="flex w-full cursor-pointer items-center justify-start border-t px-1.5 py-3 hover:bg-gray-100"
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                    >
                      <FiLogOut size={20} />
                      <span className="pl-2 text-sm font-semibold">{t("logout")}</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(NavBar);
