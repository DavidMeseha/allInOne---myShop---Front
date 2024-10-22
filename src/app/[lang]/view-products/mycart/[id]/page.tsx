import React from "react";
import ProductViewPage from "../../components/ProductViewPage";
import { ShoppingCartProduct } from "@/types";
import axios from "@/lib/axiosInstance";
import { cookies } from "next/headers";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const id = params.id;

  const getProducts = async () => {
    const res = await axios.get<{ shopping_carts: ShoppingCartProduct[] }>("/shopping_cart_items/my_cart", {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    });

    return res.data.shopping_carts;
  };

  const products = (await getProducts()).map((item) => item.product);
  const mainProduct = products.filter((item) => item.id === parseInt(id))[0];

  return (
    <ProductViewPage mainProduct={mainProduct} products={products.filter((product) => product.id !== mainProduct.id)} />
  );
}
