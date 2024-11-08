import axios from "@/lib/axios";

const getReviewedIds = async () => {
  try {
    const ids = await axios.get<string[]>(`/api/user/reviewedIds`);
    return ids.data;
  } catch {
    return [];
  }
};

export default getReviewedIds;
