"use client";

import { useGeneralStore } from "@/stores/generalStore";
import { Order } from "@/types";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import DropdownButton from "@/components/DropdownButton";
import OrdersAdvancedSearch, { OrdersAdvancedSearchOverlay } from "../components/OrdersAdvancedSearch";
import _ from "lodash";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "@/context/Translation";

type AdvancedSearch = {
  startDate: Date;
  endDate: Date;
  productName: string;
  paymentStatuses: any[];
  billingPhone: string;
  billingEmail: string;
  billingLastName: string;
  warehouse: string;
  billingCountry: string;
  orderNotes: string;
};

const initialAdvancedSearch: AdvancedSearch = {
  startDate: new Date(),
  endDate: new Date(),
  productName: "",
  paymentStatuses: [],
  billingPhone: "",
  billingEmail: "",
  billingLastName: "",
  warehouse: "",
  billingCountry: "",
  orderNotes: ""
};

export default function OrdersPage() {
  const { isAdvancedSearchOpen, setIsAdvancedSearchOpen } = useGeneralStore();
  const { t } = useTranslation();
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [searchOptions, setSearchOptions] = useState<AdvancedSearch>(initialAdvancedSearch);
  const data: Order[] = [
    {
      customer_currency_code: "",
      id: 1,
      number: 6956321521,
      order_status: "Pending",
      order_total: 500,
      paid_date_utc: new Date().toString(),
      payment_status: "unknown",
      shipping_method: "air",
      shipping_status: "unknown"
    },
    {
      customer_currency_code: "",
      id: 2,
      number: 1235145615,
      order_status: "Pending",
      order_total: 500,
      paid_date_utc: new Date().toString(),
      payment_status: "unknown",
      shipping_method: "air",
      shipping_status: "unknown"
    }
  ];

  const OrderSelectChange = (isChecked: boolean, order: Order) => {
    const tempSelected = [...selectedOrders];
    if (isChecked) {
      tempSelected.push({ ...order });
    } else {
      tempSelected.splice(
        tempSelected.findIndex((orderItem) => order.id === orderItem.id),
        1
      );
    }
    setSelectedOrders([...tempSelected]);
  };

  const searchChangeHandle = (name: string, value: any) => {
    setSearchOptions({ ...searchOptions, [name]: value });
  };

  const confirmSearch = () => {
    setIsAdvancedSearchOpen(false);
    console.log(searchOptions);
  };

  const selectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    if (event.target.checked) setSelectedOrders([...data]);
    else setSelectedOrders([]);
  };

  const handleExport = (selected: string) => {
    if (selected === "XML(All Found)") return;
    if (selected === "XML(Selected)") return;
    if (selected === "Excel(All Found)") return;
    if (selected === "Excel(Selected)") return;
  };

  const handlePrint = (selected: string) => {
    if (selected === "XML(All Found)") return;
    if (selected === "XML(Selected)") return;
    if (selected === "Excel(All Found)") return;
    if (selected === "Excel(Selected)") return;
  };

  return (
    <div className="px-4">
      <div className="hidden md:block">
        <OrdersAdvancedSearch confirm={confirmSearch} onChange={searchChangeHandle} />
      </div>
      <div className="sticky top-11 z-20 bg-white py-4 md:top-14">
        <div className="flex gap-2">
          <input
            className="w-full rounded-md border-strongGray focus:border-primary focus:ring-primary"
            placeholder={t("vendor.enterProductSKU")}
            type="text"
          />
          <button className="rounded-md bg-primary px-4 py-2 text-white">{t("go")}</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-white">
          <DropdownButton
            className="bg-green-700"
            options={["XML(All Found)", "XML(Selected)", "Excel(All Found)", "Excel(Selected)"]}
            onSelectItem={handleExport}
          >
            {t("vendor.export")}
          </DropdownButton>
          <DropdownButton
            className="bg-green-700"
            options={["Print Selected", "Print All Found"]}
            onSelectItem={handlePrint}
          >
            {t("vendor.printInvoices")}
          </DropdownButton>
          <Button className="bg-purple-700">Import</Button>
          <Checkbox
            checked={!!selectedOrders.length && _.isEqual(_.sortBy(data, "id"), _.sortBy(selectedOrders, "id"))}
            className="cursor-pointer select-none rounded-sm bg-gray-700"
            label={t("vendor.selectAll")}
            onChange={selectAll}
          />
        </div>
      </div>
      <ul className="mt-2 select-none">
        {data &&
          data.map((order) => (
            <OrderItem
              isSelected={!!selectedOrders.find((orderItem) => order.id === orderItem.id)}
              key={order.id}
              order={order}
              selectOrder={(e) => OrderSelectChange(e.target.checked, order)}
            />
          ))}
      </ul>
      {isAdvancedSearchOpen ? (
        <OrdersAdvancedSearchOverlay confirm={confirmSearch} onChange={searchChangeHandle} />
      ) : null}
    </div>
  );
}

//----Product Item--
type OrderItemProps = {
  order: Order;
  isSelected: boolean;
  selectOrder: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function OrderItem({ order, isSelected, selectOrder }: OrderItemProps) {
  const { t } = useTranslation();
  return (
    <li className="py-2">
      <label className="flex items-center justify-between" htmlFor={order.id.toString()}>
        <div className="pb-2 pe-2">
          <input
            checked={isSelected}
            className="me-2 border-red-300 bg-red-100 text-red-500 focus:ring-red-200"
            id={order.id.toString()}
            name="products"
            type="checkbox"
            onChange={selectOrder}
          />
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="border-e pe-4 text-lg font-bold">#{order.id}</div>
          <div>
            <p className="font-bold">
              {order.billing_address?.email}{" "}
              <span
                className={`font-normal ${order.order_status === "Processing" ? "text-blue-600" : order.order_status == "Pending" ? "text-amber-500" : "text-green-600"}`}
              >
                ({order.order_status})
              </span>
            </p>
            <p className="text-strongGray">
              {moment.utc(order.created_on_utc).local().calendar()},{" "}
              <span className="font-bold">{order.order_total}$</span>
            </p>
          </div>
        </div>
        <Link className="text-strongGray" href={`/profile/order-details/${order.id}`}>
          {t("details")}
        </Link>
      </label>
    </li>
  );
}
