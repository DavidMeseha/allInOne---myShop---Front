import axios from "@/lib/axiosInstance";
import { IFullProduct } from "@/types";

const createProduct = async (product: IFullProduct) => {
  try {
    await axios.post("/products", { product: { ...product } });
  } catch (error) {
    console.table(error);
  }
};

export default createProduct;
