"use client";

import FormDropdownInput from "@/components/FormDropdownInput";
import FormTextInput from "@/components/FormTextInput";
import { FieldError, IAddress } from "@/types";
import { useRouter } from "next-nprogress-bar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/context/Translation";
import BackArrow from "@/components/BackArrow";
import AddressItem from "./AddressItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import Button from "@/components/Button";
import { useGeneralStore } from "@/stores/generalStore";
import { toast } from "react-toastify";

interface FormErrors {
  address: FieldError;
  city: FieldError;
  country: FieldError;
}
type Tap = "newaddress" | "addresses" | "editaddress";
const initialErrors: FormErrors = { address: false, city: false, country: false };
const initialForm = { _id: "", address: "", city: "", country: "" };

export default function AddressesPage() {
  const router = useRouter();
  const [activeTap, setActiveTap] = useState<Tap>("addresses");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<FormErrors>(initialErrors);
  const { t } = useTranslation();
  const { countries } = useGeneralStore();

  useEffect(() => {
    if (!countries.length) return;
    setForm({ ...form, country: countries[0]._id });
  }, [countries]);

  const addresses = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => axiosInstanceNew.get<IAddress[]>("/api/user/addresses").then((res) => res.data)
  });

  const newAddressMutation = useMutation({
    mutationKey: ["addAddress"],
    mutationFn: () =>
      axiosInstanceNew.post("/api/user/addresses/add", {
        city: form.city,
        country: form.country,
        address: form.address
      }),
    onSuccess: () => {
      addresses.refetch();
      toast.success("Address Added Successfully");
    }
  });

  const updateAddressMutation = useMutation({
    mutationKey: ["addAddress"],
    mutationFn: () =>
      axiosInstanceNew.put(`/api/user/addresses/edit/${form._id}`, {
        city: form.city,
        country: form.country,
        address: form.address
      }),
    onSuccess: () => {
      addresses.refetch();
      toast.success("Address Updated Successfully");
    }
  });

  const citiesQuery = useQuery({
    queryKey: ["cities", form.country],
    queryFn: () =>
      axiosInstanceNew
        .get<{ name: string; code: string; _id: string }[]>(`/api/common/cities/${form.country}`)
        .then((res) => {
          setForm({ ...form, city: res.data[0]._id });
          return res.data;
        }),
    enabled: !!form.country
  });

  const validate = () => {
    setError(initialErrors);
    let isError = false;
    let errors = { ...error };

    if (!form.address) {
      errors = { ...errors, address: t("addresses.addressIsRequired") };
      isError = true;
    }
    if (!form.city) {
      errors = { ...errors, city: t("addresses.cityIsRequired") };
      isError = true;
    }
    if (!form.country) {
      errors = { ...errors, country: t("addresses.countryIsRequired") };
      isError = true;
    }
    setError({ ...errors });
    return isError;
  };

  const addNewAddress = () => {
    if (validate()) return;
    newAddressMutation.mutate();
  };

  const updateAddress = () => {
    if (validate()) return;
    updateAddressMutation.mutate();
  };

  const changeTap = (value: Tap) => {
    setError(initialErrors);
    setActiveTap(value);

    if (value === "editaddress") {
      if (!addresses.data?.[0]) return;
      const address = addresses.data[0];
      setForm({ _id: address._id, city: address.city._id, address: address.address, country: address.country._id });
    } else setForm(initialForm);
  };
  const handleFieldOnChange = (value: string, name: string) => {
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: false });
  };

  const handleEditAddressChange = (id: string) => {
    const address = addresses.data?.findLast((address) => address._id === id) || null;
    if (!address) return;
    setForm({ _id: address._id, city: address.city._id, address: address.address, country: address.country._id });
  };

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-20 w-full border bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">{t("addresses.manageAddresses")}</h1>
          <div className="w-6"></div>
        </div>
        <ul className="z-10 mt-2 flex w-full items-center border-b bg-white">
          {addresses.data && addresses.data.length ? (
            <li className={`w-full ${activeTap === "editaddress" && "-mb-0.5 border-b-2 border-b-black"}`}>
              <a className="flex cursor-pointer justify-center py-2" onClick={() => changeTap("editaddress")}>
                {t("addresses.editAddress")}
              </a>
            </li>
          ) : null}
          <li className={`w-full ${activeTap === "newaddress" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <a className="flex cursor-pointer justify-center py-2" onClick={() => changeTap("newaddress")}>
              {t("addresses.newAddress")}
            </a>
          </li>
          <li className={`w-full ${activeTap === "addresses" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <a className="flex cursor-pointer justify-center py-2" onClick={() => changeTap("addresses")}>
              {t("profile.addresses")}
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-32 px-4 pb-6 md:mt-0">
        {activeTap === "addresses" ? (
          addresses.data && addresses.data.length > 0 ? (
            addresses.data.map((address) => (
              <AddressItem
                address={address}
                key={address._id}
                handleDelete={(id) => {
                  console.log(id);
                }}
                handleEdit={(id) => {
                  console.log(id);
                }}
              />
            ))
          ) : (
            <div className="text-center">
              No Avilable Adresses!{" "}
              <span className="cursor-pointer text-primary hover:underline" onClick={() => setActiveTap("newaddress")}>
                Add one ?
              </span>
            </div>
          )
        ) : null}

        {activeTap === "editaddress" || activeTap === "newaddress" ? (
          <>
            {activeTap === "editaddress" && (
              <FormDropdownInput
                error={form.address.length > 0 ? false : "Select and address to update"}
                label={t("addresses.addressToEdit")}
                name="addresstoedit"
                options={addresses.data?.map((address) => ({ name: address.address, value: address._id })) || []}
                value={form._id}
                onUpdate={handleEditAddressChange}
              />
            )}

            <FormTextInput
              error={error.address}
              inputType="text"
              name="address"
              placeholder={t("address")}
              value={form.address}
              onUpdate={handleFieldOnChange}
            />

            <FormDropdownInput
              error={error.country}
              label={t("country")}
              name="country"
              options={countries.map((country) => ({ name: country.name, value: country._id }))}
              value={form.country}
              onUpdate={handleFieldOnChange}
            />

            <FormDropdownInput
              error={error.city}
              isLoading={citiesQuery.isFetching}
              label={t("city")}
              name="city"
              options={citiesQuery.data?.map((city) => ({ name: city.name, value: city._id })) || []}
              value={form.city}
              onUpdate={handleFieldOnChange}
            />

            <div className="fixed bottom-0 start-0 z-50 w-full border border-x-0 bg-white px-6 py-4 md:start-[280px] md:w-[calc(100%-280px)]">
              <Button
                className="w-full bg-primary py-2 text-white"
                isLoading={newAddressMutation.isPending || addresses.isFetching}
                onClick={() => (activeTap === "newaddress" ? addNewAddress() : updateAddress())}
              >
                {activeTap === "newaddress" ? t("addresses.addAddress") : t("addresses.updateAddress")}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
