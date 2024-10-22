"use client";

import Reviews from "@/components/post/Reviews";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import { IFullProduct, IProductReview } from "@/types";
import ProductHeader from "@/components/post/ProductHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstanceNew from "@/lib/axiosInstanceNew";
import RatingStars from "@/components/RatingStars";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { useGeneralStore } from "@/stores/generalStore";
import { useUser } from "@/context/user";
import { toast } from "react-toastify";
import { queryClient } from "@/components/layout/MainLayout";

export default function ProductPage({ product }: { product: IFullProduct }) {
  const { lang } = useTranslation();
  const [review, setReview] = useState<string>("");
  const [rate, setRate] = useState(0);
  const { user } = useUser();
  const { setIsLoginOpen } = useGeneralStore();

  const addReviewMutation = useMutation({
    mutationKey: ["AddReview"],
    mutationFn: (productId: string) =>
      axiosInstanceNew.post(`/api/user/addReview/${productId}`, {
        reviewText: review,
        rating: rate
      }),

    onSuccess: () => {
      toast.success("Review Added Successfully");
      queryClient.fetchQuery({ queryKey: ["productReviews", product._id] });
      setRate(0);
      setReview("");
    },

    onError: () => toast.error("Failed to add review")
  });

  const addReview = () => {
    if (!user) return;
    if (rate <= 0 || review.length === 0) return;
    if (user && !user.isRegistered) setIsLoginOpen(true);
    addReviewMutation.mutate(product._id);
  };

  const reviewsQuery = useQuery({
    queryKey: ["productReviews", product._id],
    queryFn: () => axiosInstanceNew.get<IProductReview[]>(`/api/product/reviews/${product._id}`).then((res) => res.data)
  });

  return (
    <>
      <div className="z-30 h-screen justify-between overflow-auto bg-black lg:flex" id="PostPage">
        <div className="relative md:h-full lg:w-[calc(100%-540px)]">
          <Link
            className="absolute start-0 z-20 m-5 rounded-full bg-gray-700 p-1.5 text-white hover:bg-gray-800"
            href={`/${lang}`}
          >
            <AiOutlineClose size="27" />
          </Link>

          <>
            <Image
              alt={product.name}
              className="absolute z-[0] h-screen w-full object-cover"
              height={1200}
              src={product.pictures[0].imageUrl}
              width={1200}
            />
            <div className="relative z-10 flex h-full items-center justify-center bg-black bg-opacity-70 lg:min-w-[480px]">
              <Image
                alt={product.name}
                className="max-h-screen w-full object-contain"
                height={1200}
                src={product.pictures[0].imageUrl}
                width={1200}
              />
            </div>
          </>
        </div>

        <div className="relative h-auto w-full bg-white md:h-screen lg:max-w-[550px]">
          <div className="h-full overflow-auto">
            <ProductHeader product={product} />
            <Reviews productId={product._id} reviews={reviewsQuery.data} />
          </div>
          <div className="absolute bottom-0 z-50 w-full border-t-2 bg-white px-8 pt-2">
            <div className="flex items-center">
              <span>Rate: </span>
              <RatingStars className="ms-2 inline-flex" isEditable rate={rate} onChange={(value) => setRate(value)} />
            </div>
            <div className="flex w-full items-center justify-between">
              <Input
                className="w-2/3"
                label=""
                placeholder="Add Review...."
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <Button
                className={`ml-5 text-sm font-semibold ${review ? "cursor-pointer text-primary" : "cursor-not-allowed text-gray-400"} `}
                disabled={!review}
                onClick={addReview}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
