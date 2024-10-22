import axios from "@/lib/axiosInstance";
import { NewProduct } from "../types";

const createProduct = async (product: NewProduct) => {
  try {
    await axios.post("/products", { product: { ...product } });
  } catch (error) {
    console.table(error);
  }
};

export default createProduct;
