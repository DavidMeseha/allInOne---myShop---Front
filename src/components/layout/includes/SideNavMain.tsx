import { useUser } from "@/context/user";
import VendorMenu from "@/components/VendorMenu";
import MainMenu from "@/components/MainMenu";

export default function SideNavMain() {
  const { user } = useUser();

  return (
    <>
      <div className="fixed z-20 hidden h-full w-[270px] overflow-auto border-e bg-white pe-2 pt-[70px] md:block">
        <div className="mx-auto w-full">
          <MainMenu />
          {user?.is_vendor ? <VendorMenu /> : null}
        </div>
      </div>
    </>
  );
}
