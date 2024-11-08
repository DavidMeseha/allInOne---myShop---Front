import axios from "@/lib/axios";

const getCartIds = async () => {
  try {
    const items = await axios.get<{ product: string; quantity: number }[]>(`/api/common/cart/ids`);
    return items.data;
  } catch {
    return [];
  }
};

export default getCartIds;
