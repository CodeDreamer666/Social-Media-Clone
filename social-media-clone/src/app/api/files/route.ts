import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "~/app/utils/config"
import { fileTypeFromBuffer } from "file-type";
import { auth } from "~/server/better-auth";
import { headers } from "next/headers";
import { api } from "~/trpc/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export async function POST(request: NextRequest) {
    try {
        const currentUser = await auth.api.getSession({
            headers: await headers(),
        });

        if (!currentUser?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No image uploaded" },
                { status: 400 }
            );
        }

        if (file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json(
                { error: "Image must be smaller than 5MB" },
                { status: 400 }
            );
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Only JPG, PNG, and WebP images are allowed" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const realFileType = await fileTypeFromBuffer(buffer);

        if (!realFileType || !ALLOWED_IMAGE_TYPES.includes(realFileType.mime)) {
            return NextResponse.json(
                { error: "Invalid image file" },
                { status: 400 }
            );
        }

        const { cid } = await pinata.upload.public.file(file)
        const files = await pinata.files.public.list()
        const url = await pinata.gateways.public.convert(cid);

        return NextResponse.json({
            imageId: files.files[0]?.id,
            imageUrl: url,
            imageCid: cid
        }, {
            status: 200
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const currentUser = await auth.api.getSession({
            headers: await headers(),
        });

        if (!currentUser?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { imageCid, imageId } = await request.json();

        if (!imageCid || !imageId) {
            return NextResponse.json(
                { error: "Image CID and Image ID is required" },
                { status: 400 }
            );
        }

        // 2. Check this image belongs to the current user
        // 3. Check image is not already attached to a post
        // 4. Unpin/delete from Pinata
        // 5. Delete image record from your DB

        await pinata.files.public.delete([imageId])

        return NextResponse.json({ success: true });


    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}