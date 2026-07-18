import type { db } from "~/server/db";

type DbClient = typeof db;

export function getConnectionPairKey(userOneId: string, userTwoId: string) {
  return [userOneId, userTwoId].sort().join(":");
}

type CanViewPrivateContentProps = {
  db: DbClient;
  viewerId: string;
  authorId: string;
  authorIsPublic: boolean;
};

export async function canViewPrivateContent({
  db,
  viewerId,
  authorId,
  authorIsPublic,
}: CanViewPrivateContentProps) {
  if (authorIsPublic || viewerId === authorId) {
    return true;
  }

  const connection = await db.connection.findUnique({
    where: {
      pairKey: getConnectionPairKey(viewerId, authorId),
    },
    select: {
      status: true,
    },
  });

  return connection?.status === "ACCEPTED";
}
