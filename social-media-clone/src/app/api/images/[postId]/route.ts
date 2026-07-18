import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "~/server/better-auth";
import { db } from "~/server/db";
import { createPrivateImageResponse } from "~/server/imageResponse";
import { canViewPrivateContent } from "~/server/permissions";

type RouteContext = {
  params: Promise<{ postId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const postId = z.string().uuid().safeParse(params.postId);

  if (!postId.success) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const post = await db.post.findUnique({
    where: { id: postId.data },
    select: {
      userId: true,
      imageUrl: true,
      user: {
        select: { isPublic: true },
      },
    },
  });

  if (!post?.imageUrl) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const canViewImage = await canViewPrivateContent({
    db,
    viewerId: session.user.id,
    authorId: post.userId,
    authorIsPublic: post.user.isPublic,
  });

  if (!canViewImage) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return createPrivateImageResponse(post.imageUrl);
}
