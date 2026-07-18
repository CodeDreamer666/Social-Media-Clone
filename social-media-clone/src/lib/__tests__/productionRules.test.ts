import { describe, expect, it, vi } from "vitest";

import { getFeedInterests } from "../interests";
import {
  getNextInterestUpdateAt,
  INTEREST_UPDATE_COOLDOWN_MS,
} from "../interestCooldown";
import { getSafeRedirectPath } from "../safeRedirect";
import { formatTimeAgo } from "../useTimeAgo";
import {
  canViewPrivateContent,
  getConnectionPairKey,
} from "../../server/permissions";
import { getProtectedPostImageUrl } from "../../server/postPresentation";
import {
  getFeedVisibilityWhere,
  rankFeedPostsByInterest,
} from "../../server/api/feedVisibility";

type PermissionDb = Parameters<typeof canViewPrivateContent>[0]["db"];

describe("production rules", () => {
  it("uses one canonical key for either connection direction", () => {
    expect(getConnectionPairKey("user-b", "user-a")).toBe(
      getConnectionPairKey("user-a", "user-b"),
    );
  });

  it("allows private content only to its owner or an accepted connection", async () => {
    const findUnique = vi
      .fn()
      .mockResolvedValueOnce({ status: "PENDING" })
      .mockResolvedValueOnce({ status: "ACCEPTED" });
    const db = {
      connection: { findUnique },
    } as unknown as PermissionDb;

    await expect(
      canViewPrivateContent({
        db,
        viewerId: "viewer",
        authorId: "author",
        authorIsPublic: false,
      }),
    ).resolves.toBe(false);

    await expect(
      canViewPrivateContent({
        db,
        viewerId: "viewer",
        authorId: "author",
        authorIsPublic: false,
      }),
    ).resolves.toBe(true);

    await expect(
      canViewPrivateContent({
        db,
        viewerId: "author",
        authorId: "author",
        authorIsPublic: false,
      }),
    ).resolves.toBe(true);
  });

  it("requires exactly three interests before applying interest ranking", () => {
    expect(getFeedInterests([])).toEqual([]);
    expect(getFeedInterests(["Coding", "Books"])).toEqual([]);
    expect(getFeedInterests(["Coding", "Books", "Design"])).toEqual([
      "Coding",
      "Books",
      "Design",
    ]);
  });

  it("keeps public posts visible before the viewer selects three interests", () => {
    const where = getFeedVisibilityWhere("viewer", []);
    const publicPostRule = where.OR?.[1];

    expect(publicPostRule).toEqual({
      userId: {
        not: "viewer",
      },
      user: {
        isPublic: true,
      },
    });
    expect(publicPostRule).not.toHaveProperty("interest");
  });

  it("filters incoming posts to the viewer's three selected interests", () => {
    const where = getFeedVisibilityWhere("viewer", [
      "Coding",
      "Books",
      "Design",
    ]);

    expect(where.OR?.[0]).not.toHaveProperty("interest");
    expect(where.OR?.[1]).toMatchObject({
      interest: {
        in: ["Coding", "Books", "Design"],
      },
      user: {
        isPublic: true,
      },
    });
    expect(where.OR?.[2]).toMatchObject({
      interest: {
        in: ["Coding", "Books", "Design"],
      },
      user: {
        isPublic: false,
      },
    });
  });

  it("ranks matching interests before other visible public posts", () => {
    const posts = [
      {
        id: "public-other-interest",
        interest: "Art",
        createdAt: new Date("2026-07-16T12:00:00.000Z"),
      },
      {
        id: "matching-interest",
        interest: "Coding",
        createdAt: new Date("2026-07-16T11:00:00.000Z"),
      },
    ];

    expect(
      rankFeedPostsByInterest(posts, ["Coding"]).map((post) => post.id),
    ).toEqual(["matching-interest", "public-other-interest"]);
  });

  it("calculates the cooldown from exactly seven 24-hour periods", () => {
    const lastUpdatedAt = new Date("2026-07-01T12:30:00.000Z");
    const nextUpdateAt = getNextInterestUpdateAt(lastUpdatedAt);

    expect(nextUpdateAt.getTime() - lastUpdatedAt.getTime()).toBe(
      INTEREST_UPDATE_COOLDOWN_MS,
    );
    expect(nextUpdateAt.toISOString()).toBe("2026-07-08T12:30:00.000Z");
  });

  it("rejects external and protocol-relative auth redirects", () => {
    expect(getSafeRedirectPath("/profile/edit")).toBe("/profile/edit");
    expect(getSafeRedirectPath("https://example.com")).toBe("/");
    expect(getSafeRedirectPath("//example.com")).toBe("/");
    expect(getSafeRedirectPath("/\\example.com")).toBe("/");
  });

  it("exposes only an authenticated app path for stored post images", () => {
    expect(getProtectedPostImageUrl("post-id", true)).toBe(
      "/api/images/post-id",
    );
    expect(getProtectedPostImageUrl("post-id", false)).toBeNull();
  });

  it("formats stable calm relative-time labels", () => {
    const now = new Date("2026-07-16T12:00:00.000Z");

    expect(formatTimeAgo(new Date("2026-07-16T11:59:45.000Z"), now)).toBe(
      "now",
    );
    expect(formatTimeAgo(new Date("2026-07-16T11:15:00.000Z"), now)).toBe(
      "45m",
    );
    expect(formatTimeAgo(new Date("2026-07-14T12:00:00.000Z"), now)).toBe("2d");
  });
});
