import axios from "@/lib/axios";

const getLikeIds = async () => {
  try {
    const items = await axios.get<string[]>("/api/user/likesId");
    return items.data;
  } catch {
    return [];
  }
};

export default getLikeIds;
