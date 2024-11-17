import MainMenu from "@/components/MainMenu";

export default function SideNav() {
  return (
    <>
      <nav className="fixed z-20 hidden h-full w-[230px] overflow-auto border-e bg-white pe-2 ps-2 pt-[70px] md:block rtl:ps-6">
        <div className="mx-auto w-full">
          <MainMenu />
          {/* {user?.isVendor ? <VendorMenu /> : null} */}
        </div>
      </nav>
    </>
  );
}
