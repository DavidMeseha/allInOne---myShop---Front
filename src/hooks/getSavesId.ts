import axios from "@/lib/axios";

const getSavesId = async () => {
  try {
    const items = await axios.get<string[]>("/api/user/savesId");
    return items.data;
  } catch {
    return [];
  }
};

export default getSavesId;
