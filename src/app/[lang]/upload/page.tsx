"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { BiMinus, BiSolidCloudUpload } from "react-icons/bi";
import { useRouter } from "next-nprogress-bar";
import { useUser } from "@/context/user";
import { FieldError } from "../../../types";
// import createProduct from "../../../hooks/createProduct";
import { TagsInput } from "react-tag-input-component";
import "react-advanced-cropper/dist/style.css";
import FormTextInput from "../../../components/FormTextInput";
import { useGeneralStore } from "../../../stores/generalStore";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Cropper, CropperRef } from "react-advanced-cropper";
// import useUploadImage from "../../../hooks/useUploadImage";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { useTranslation } from "@/context/Translation";
import Checkbox from "@/components/Checkbox";
import Image from "next/image";

const initialNewProduct = {
  name: "",
  description: "",
  is_free_shipping: true,
  stock_quantity: 0,
  price: 0,
  old_price: 0,
  video: {
    file_name: ""
  },
  images: [],
  tags: []
};

interface Errors {
  name: FieldError;
  description: FieldError;
  stock_quantity: FieldError;
  price: FieldError;
  old_price: FieldError;
  video: FieldError;
  images: FieldError;
  tags: FieldError;
}

const initialErrors: Errors = {
  name: false,
  description: false,
  stock_quantity: false,
  price: false,
  old_price: false,
  video: false,
  images: false,
  tags: false
};

export default function Upload() {
  const { user } = useUser();
  const { setIsLoginOpen } = useGeneralStore();
  const { t } = useTranslation();
  const router = useRouter();

  const [product, setProduct] = useState(initialNewProduct);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<Errors>(initialErrors);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const cropperRef = useRef<CropperRef>(null);
  const [cropping, setCropping] = useState<string | null>(null);

  // const uploadImageMutation = useUploadImage({
  //   onSuccess: (data) => {
  //     console.log(data);
  //     if (!data.success) return toast.error(t("upload.unableToUpload"));
  //     const tempImages = [...images];
  //     tempImages.push(data);
  //     setImages(tempImages);
  //     setProduct({
  //       ...product,
  //       images: tempImages.map((image, index) => ({
  //         picture_id: image.pictureId,
  //         position: index,
  //         src: image.imageUrl
  //       }))
  //     });
  //     setCropping(null);
  //     toast.success("Image Uploaded");
  //   },
  //   onError: (e) => toast.error(e.message)
  // });

  const validate = () => {
    setError(initialErrors);
    let isError = false;
    let errors = { ...error };

    if (!product.description) {
      errors = { ...errors, description: t("upload.descriptionIsRequired") };
      isError = true;
    }
    if (!product.stock_quantity) {
      errors = { ...errors, stock_quantity: t("upload.stockQuantityIsRequired") };
      isError = true;
    }
    if (!product.images || !(product.images.length > 0)) {
      errors = { ...errors, images: t("upload.oneImageAtLeastRequired") };
      isError = true;
    }
    if (!product.name) {
      errors = { ...errors, name: t("upload.productNameIsRequired") };
      isError = true;
    }
    if (!product.price || product.price <= 0) {
      errors = { ...errors, price: t("upload.positvePriceValueIsRequired") };
      isError = true;
    }
    if (product.old_price <= 0) {
      errors = { ...errors, old_price: t("upload.oldPriceShouldBePositveValue") };
      isError = true;
    }
    if (!product.tags || !product.tags.length) {
      errors = { ...errors, tags: t("upload.needToAddAtLeastOneTag") };
      isError = true;
    }
    setError({ ...errors });
    return isError;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setCropping(reader.result?.toString() || ""));
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleRemoveImage = (index: number) => {
    const tempProductImages = [...product.images];
    const tempViewImages = [...images];
    tempProductImages.splice(index, 1);
    tempViewImages.splice(index, 1);
    setProduct({ ...product, images: [...tempProductImages] });
    setImages(tempViewImages);
  };

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  const inputChangeHandle = (value: any, name: string) => {
    setError({ ...error, [name]: false });
    setProduct({ ...product, [name]: value });
  };

  function confirmImageCrop() {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "croppedImg.webp", { type: blob.type });
          const formData = new FormData();
          formData.append("file", file);
          // uploadImageMutation.mutate(formData);
        }
      }, "image/webp");
      setError({ ...error, images: false });
    }
  }

  const createNewProduct = async () => {
    const isError = validate();
    if (isError) return;
    if (!user || !user.isRegistered) return setIsLoginOpen(true);
    setIsUploading(true);

    try {
      // await createProduct(product);
      toast.success(t("upload.productAddedSuccessfully"));
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      alert(error);
    }
  };

  return (
    <>
      <div className="mb-[40px] rounded-md bg-white px-4 py-6 shadow-lg md:px-10">
        <div>
          <h1 className="text-[23px] font-semibold">{t("upload.addNewProduct")}</h1>
          <h2 className="mt-1 text-gray-400">{t("upload.addProductToYourVendorAccount")}</h2>
        </div>

        <div className="mt-8 gap-6">
          {!cropping ? (
            <>
              <label
                className="mx-auto mb-2 mt-4 flex h-[470px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-center hover:bg-gray-100 md:mx-0"
                htmlFor="fileInput"
              >
                <BiSolidCloudUpload color="#b3b3b1" size="40" />
                <p className="mt-4 text-[17px]">{t("upload.selectImageToUpload")}</p>
                <p className="mt-1 text-[13px] text-gray-500">{t("upload.OrDragAndDropFile")}</p>
                <p className="mt-1 text-sm text-gray-400">JPEG, PNG</p>
                <label
                  className="mt-8 w-[80%] cursor-pointer rounded-sm bg-[#F02C56] px-2 py-1.5 text-[15px] text-white"
                  htmlFor="fileInput"
                >
                  {t("upload.selectFile")}
                </label>
                <input accept="image/*" hidden id="fileInput" type="file" onChange={handleFileChange} />
              </label>
              <Carousel className="mt-4">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem className="basis-1/2 md:basis-1/4 lg:basis-1/6" key={image}>
                      <div className="flex w-full justify-center">
                        <div className="relative">
                          <Image
                            alt="New image"
                            className="min-h-[200px]"
                            height={250}
                            src={image}
                            style={{ width: "auto", height: "auto" }}
                            width={150}
                          />
                          <a
                            className="absolute end-1 top-1 z-10 cursor-pointer rounded-full bg-primary"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <BiMinus className="fill-white" size={20} />
                          </a>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="mb-4 min-h-[21px] text-[14px] font-semibold text-red-500">
                {error.images ? error.images : null}
              </div>
            </>
          ) : (
            <>
              <Cropper
                className="h-[500px] rounded-sm"
                ref={cropperRef}
                src={cropping}
                stencilProps={{ aspectRatio: 9 / 18 }}
              />
              <div className="mt-4">
                <Button
                  className="me-4 bg-primary text-white"
                  // isLoading={uploadImageMutation.isPending}
                  onClick={() => confirmImageCrop()}
                >
                  {t("upload.confirm")}
                </Button>
                <Button className="rounded-md border bg-white px-4 py-2 text-black" onClick={() => setCropping(null)}>
                  {t("cancel")}
                </Button>
              </div>
            </>
          )}

          <div className="mb-6 mt-4">
            {/* <div className="flex bg-[#F8F8F8] px-6 py-4">
              <div>
                <PiKnifeLight className="mr-4" size="20" />
              </div>
              <div>
                <div className="text-semibold mb-1.5 text-[15px]">Divide videos and edit</div>
                <div className="text-semibold text-[13px] text-gray-400">
                  You can quickly divide videos into multiple parts, remove redundant parts and turn landscape videos
                  into portrait videos
                </div>
              </div>
              <div className="my-auto flex h-full w-full max-w-[130px] justify-end text-center">
                <button className="rounded-sm bg-[#F02C56] px-8 py-1.5 text-[15px] text-white">Edit</button>
              </div>
            </div> */}

            <FormTextInput
              error={error.name}
              inputType="text"
              name="name"
              placeholder={t("upload.productName")}
              value={product.name}
              onUpdate={inputChangeHandle}
            />
            <FormTextInput
              error={error.old_price}
              inputType="number"
              name="old_price"
              placeholder={t("upload.oldPrice")}
              value={product.old_price.toString()}
              onUpdate={inputChangeHandle}
            />
            <FormTextInput
              error={error.price}
              inputType="number"
              name="price"
              placeholder={t("upload.price")}
              value={product.price.toString()}
              onUpdate={inputChangeHandle}
            />
            <FormTextInput
              error={error.stock_quantity}
              inputType="number"
              name="stock_quantity"
              placeholder={t("upload.stockQuantity")}
              value={product.stock_quantity.toString()}
              onUpdate={inputChangeHandle}
            />

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="mb-1 text-[15px]">{t("upload.tags")}</div>
                <div className="text-[12px] text-gray-400">{product.tags.length}/10</div>
              </div>
              <TagsInput
                classNames={{ input: "p-1 focus:ring-0", tag: "bg-secondary" }}
                separators={[",", ";", "Enter"]}
                value={product.tags}
                onChange={() => {
                  setError({ ...error, tags: false });
                  // setProduct({ ...product, [] });
                }}
              />
              <div className="min-h-[21px] text-[14px] font-semibold text-red-500">
                {error.tags ? error.tags : null}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="mb-1 text-[15px]">{t("upload.description")}</div>
                <div className="text-[12px] text-gray-400">{product.description.length}/150</div>
              </div>
              <textarea
                className="w-full rounded-md border p-2.5 focus:border-primary focus:outline-none focus:ring-0"
                maxLength={150}
                name="description"
                rows={4}
                value={product.description}
                onChange={(e) => inputChangeHandle(e.target.value, e.target.name)}
              ></textarea>
              <div className="min-h-[21px] text-[14px] font-semibold text-red-500">
                {error.description ? error.description : null}
              </div>
            </div>

            <Checkbox
              checked={product.is_free_shipping}
              className="mr-1 inline-block"
              id="free-shipping"
              label={t("upload.freeShipping")}
              type="checkbox"
              onChange={(e) => setProduct({ ...product, is_free_shipping: e.target.checked })}
            />

            <div className="flex gap-3">
              <a
                // onClick={() => !isUploading && discard()}
                className="mt-8 rounded-sm border px-10 py-2.5 text-[16px] hover:bg-gray-100"
              >
                {t("upload.discard")}
              </a>
              <Button
                className="mt-8 border bg-[#F02C56] text-[16px] text-white"
                isLoading={isUploading}
                onClick={createNewProduct}
              >
                {t("upload.addProduct")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
