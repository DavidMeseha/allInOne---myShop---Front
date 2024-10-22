import axiosInstanceNew from "@/lib/axiosInstanceNew";

const getCartIds = async () => {
  try {
    const items = await axiosInstanceNew.get<{ product: string; quantity: number }[]>(`/api/common/cart/ids`);
    return items.data;
  } catch {
    return [];
  }
};

export default getCartIds;
