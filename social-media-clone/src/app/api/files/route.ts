import { fileTypeFromBuffer } from "file-type";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { pinata } from "~/lib/pinata";
import { auth } from "~/server/better-auth";
import { db } from "~/server/db";
import { createPrivateImageResponse } from "~/server/imageResponse";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const uploadedImageIdSchema = z.string().uuid();

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const imageIdResult = uploadedImageIdSchema.safeParse(
    request.nextUrl.searchParams.get("imageId"),
  );

  if (!imageIdResult.success) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const image = await db.uploadedImage.findFirst({
    where: {
      id: imageIdResult.data,
      userId: user.id,
    },
    select: {
      imageUrl: true,
    },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return createPrivateImageResponse(image.imageUrl);
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 5MB" },
        { status: 400 },
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are allowed" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const realFileType = await fileTypeFromBuffer(buffer);

    if (
      !realFileType ||
      !ALLOWED_IMAGE_TYPES.has(realFileType.mime) ||
      realFileType.mime !== file.type
    ) {
      return NextResponse.json(
        { error: "The image type does not match its contents" },
        { status: 400 },
      );
    }

    const uploadedImage = await pinata.upload.public.file(file);

    try {
      const imageUrl = await pinata.gateways.public.convert(uploadedImage.cid);
      const imageRecord = await db.uploadedImage.create({
        data: {
          userId: user.id,
          imageCid: uploadedImage.cid,
          imageUrl,
          imageId: uploadedImage.id,
        },
        select: {
          id: true,
        },
      });

      return NextResponse.json({
        uploadedImageId: imageRecord.id,
        previewUrl: `/api/files?imageId=${encodeURIComponent(imageRecord.id)}`,
      });
    } catch (error) {
      try {
        await pinata.files.public.delete([uploadedImage.id]);
      } catch {
        // The original error is more useful. Orphan cleanup is reported below.
      }

      throw error;
    }
  } catch (error) {
    console.error("Image upload failed", {
      reason: error instanceof Error ? error.message : "Unknown upload error",
    });

    return NextResponse.json(
      { error: "Image upload failed. Please try again" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const result = z
      .object({ uploadedImageId: uploadedImageIdSchema })
      .safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const selectedImage = await db.uploadedImage.findFirst({
      where: {
        id: result.data.uploadedImageId,
        userId: user.id,
        isIncludeInPost: false,
        postId: null,
      },
      select: {
        id: true,
        imageId: true,
      },
    });

    if (!selectedImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await pinata.files.public.delete([selectedImage.imageId]);
    await db.uploadedImage.delete({ where: { id: selectedImage.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unused image cleanup failed", {
      reason:
        error instanceof Error ? error.message : "Unknown image cleanup error",
    });

    return NextResponse.json(
      { error: "Image could not be removed" },
      { status: 500 },
    );
  }
}
