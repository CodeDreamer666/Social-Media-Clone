import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod"

export const imageRouter = createTRPCRouter({
    uploadImage: protectedProcedure
        .input(z.object({
            imageUrl: z
                .string()
                .url()
                .refine((url) => url.startsWith("https://tomato-voluntary-clam-90.mypinata.cloud/ipfs/"), {
                    message: "Invalid image URL.",
                }),
            imageCid: z
                .string()
                .min(10, "Invalid image CID")
                .max(120, "Invalid image CID"),
            imageId: z
                .string()
                .min(10, "Invalid image ID")
                .max(120, "Invalid Image ID")
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            await ctx.db.uploadedImage.create({
                data: {
                    userId,
                    imageCid: input.imageCid,
                    imageUrl: input.imageUrl,
                    imageId: input.imageId
                }
            });

            return { success: true }
        }),
})
