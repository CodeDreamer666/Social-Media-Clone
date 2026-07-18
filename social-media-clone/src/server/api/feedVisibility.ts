import type { Interests, Prisma } from "../../../generated/prisma/client";

export function getFeedVisibilityWhere(
  viewerId: string,
  feedInterests: readonly Interests[],
): Prisma.PostWhereInput {
  const incomingPostInterestFilter: Prisma.PostWhereInput =
    feedInterests.length === 3
      ? {
          interest: {
            in: [...feedInterests],
          },
        }
      : {};

  return {
    OR: [
      {
        userId: viewerId,
      },
      {
        ...incomingPostInterestFilter,
        userId: {
          not: viewerId,
        },
        user: {
          isPublic: true,
        },
      },
      {
        ...incomingPostInterestFilter,
        userId: {
          not: viewerId,
        },
        user: {
          isPublic: false,
          OR: [
            {
              sentConnections: {
                some: {
                  responseUserId: viewerId,
                  status: "ACCEPTED",
                },
              },
            },
            {
              receivedConnections: {
                some: {
                  requestUserId: viewerId,
                  status: "ACCEPTED",
                },
              },
            },
          ],
        },
      },
    ],
  };
}

type RankableFeedPost = {
  id: string;
  interest: string | null;
  createdAt: Date;
};

export function rankFeedPostsByInterest<TPost extends RankableFeedPost>(
  posts: TPost[],
  feedInterests: readonly string[],
) {
  const selectedInterests = new Set(feedInterests);

  return [...posts].sort((firstPost, secondPost) => {
    const firstMatches = firstPost.interest
      ? selectedInterests.has(firstPost.interest)
      : false;
    const secondMatches = secondPost.interest
      ? selectedInterests.has(secondPost.interest)
      : false;

    if (firstMatches !== secondMatches) {
      return firstMatches ? -1 : 1;
    }

    const createdAtDifference =
      secondPost.createdAt.getTime() - firstPost.createdAt.getTime();

    if (createdAtDifference !== 0) {
      return createdAtDifference;
    }

    return secondPost.id.localeCompare(firstPost.id);
  });
}
