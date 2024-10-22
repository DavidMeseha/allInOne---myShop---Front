import Button from "@/components/Button";
import FormDropdownInput from "@/components/FormDropdownInput";
import { useTranslation } from "@/context/Translation";
import { useGeneralStore } from "@/stores/generalStore";
import { IAddress } from "@/types";

interface IShippingForm {
  shippingAddressId: string;
  method: "ground" | "air";
}

export default function ShippingForm({
  shipping,
  addresses,
  onChange
}: {
  shipping: IShippingForm;
  addresses: IAddress[];
  onChange: (value: string, name: string) => void;
}) {
  const { t } = useTranslation();
  const { setIsAddAddressOpen } = useGeneralStore();
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="grow">
          <FormDropdownInput
            label={t("address")}
            name="shippingAddressId"
            options={addresses.map((address) => ({ name: address.address, value: address._id }))}
            value={shipping.shippingAddressId}
            onUpdate={onChange}
          />
        </div>
        <Button className="bg-primary text-white" onClick={() => setIsAddAddressOpen(true)}>
          Add New
        </Button>
      </div>
      <div className="px-6 pb-1">
        <div className="flex items-center gap-6">
          <p className="mb-2 font-semibold">Shipping Method</p>
          <div className="mb-4 flex items-center">
            <input
              checked={shipping.method === "ground"}
              className="h-4 w-4 border-gray-300 bg-gray-100"
              id="ground"
              name="method"
              type="radio"
              value="ground"
              onChange={(e) => onChange(e.target.value, e.target.name)}
            />
            <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500" htmlFor="ground">
              {t("checkout.ground")}
            </label>
          </div>
          <div className="mb-4 flex items-center">
            <input
              checked={shipping.method === "air"}
              className="h-4 w-4 border-gray-300 bg-gray-100"
              id="air"
              name="method"
              type="radio"
              value="air"
              onChange={(e) => onChange(e.target.value, e.target.name)}
            />
            <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500" htmlFor="air">
              {t("checkout.air")}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
