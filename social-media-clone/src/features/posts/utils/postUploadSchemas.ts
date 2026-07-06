import { z } from "zod";

export const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const maxImageSize = 5 * 1024 * 1024;

export const uploadImageResponseSchema = z.object({
    imageUrl: z.string().nonempty().url(),
    imageCid: z.string().nonempty(),
    imageId: z.string().nonempty()
});
