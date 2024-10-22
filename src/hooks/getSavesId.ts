import axiosInstanceNew from "@/lib/axiosInstanceNew";

const getSavesId = async () => {
  try {
    const items = await axiosInstanceNew.get<string[]>("/api/user/savesId");
    return items.data;
  } catch {
    return [];
  }
};

export default getSavesId;
