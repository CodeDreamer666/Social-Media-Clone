"use client";
import Image from "next/image";
import type { RefObject } from "react";
import LoadingIcon from "~/components/shared/LoadingIcon";
import { allowedImageTypes } from "../utils/postUploadSchemas";

type ImageUploadFieldProps = {
  imageUrl: string;
  isImageLoading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadImage: (file: File) => Promise<void>;
};

export default function ImageUploadField({
  imageUrl,
  isImageLoading,
  fileInputRef,
  onUploadImage,
}: ImageUploadFieldProps) {
  const uploadButtonText = imageUrl ? "Change image" : "Upload image";
  const loadingText = imageUrl ? "Changing image..." : "Uploading image...";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor="postAttachment"
          className="block text-[13px] font-medium text-zinc-300"
        >
          Attachment
        </label>
      </div>
      <div
        className={[
          "rounded-2xl border border-dashed border-white/[0.1]",
          "bg-black/40 p-4 transition-colors duration-200",
          "hover:border-blue-500/40 hover:bg-black/50",
        ].join(" ")}
      >
        <div
          className={[
            "flex min-h-52 items-center justify-center overflow-hidden rounded-xl border",
            "border-white/[0.06] bg-zinc-950/70",
          ].join(" ")}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Uploaded post image preview"
              width={1200}
              height={900}
              className="max-h-80 w-full object-contain"
              unoptimized
            />
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-[14px] font-medium text-zinc-300">
                No image selected
              </p>
              <p className="mt-2 text-[13px] text-zinc-500">
                Upload an image if your post needs one.
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <input
            ref={fileInputRef}
            id="postAttachment"
            type="file"
            disabled={isImageLoading}
            accept={allowedImageTypes.join(",")}
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              await onUploadImage(file);
            }}
          />
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            disabled={isImageLoading}
            className={[
              "mt-4 h-10 cursor-pointer rounded-full border border-white/[0.08]",
              "bg-white/5 px-5 text-[14px] font-medium text-white",
              "transition-colors duration-200 hover:bg-white/10 active:scale-95",
              "disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {isImageLoading ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                {loadingText}
              </div>
            ) : (
              uploadButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
