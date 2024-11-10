import axios from "@/lib/axios";

const getReviewedIds = async () => {
  try {
    const ids = await axios.get<string[]>(`/api/common/reviewedIds`);
    return ids.data;
  } catch {
    return [];
  }
};

export default getReviewedIds;
