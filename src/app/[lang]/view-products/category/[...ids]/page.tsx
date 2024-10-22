import React from "react";
import ProductViewPage from "../../components/ProductViewPage";
import { Product } from "@/types";
import axios from "@/lib/axiosInstance";
import { cookies } from "next/headers";

type Props = {
  params: {
    ids: [id: string, productId: string];
  };
};

export default async function Page({ params }: Props) {
  const [id, productId] = params.ids;

  const mainProduct = (
    await axios.get<{ products: Product[] }>(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    })
  ).data.products[0];

  const getProducts = async (page = 1) => {
    "use server";
    const res = await axios.get<{ products: Product[] }>("/products", {
      params: {
        Limit: 4,
        Page: page,
        categoryId: id
      },
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`
      }
    });

    return res.data.products;
  };

  const products = await getProducts();

  const loadMore = async (page: number): Promise<Product[]> => {
    "use server";
    const moreProducts = await getProducts(page);
    const filteredProducts = moreProducts.filter((product) => mainProduct.id != product.id);
    return filteredProducts || [];
  };

  return (
    <ProductViewPage
      isInfinteScroll
      loadMore={loadMore}
      mainProduct={mainProduct}
      products={products.filter((product) => product.id !== mainProduct.id)}
    />
  );
}
