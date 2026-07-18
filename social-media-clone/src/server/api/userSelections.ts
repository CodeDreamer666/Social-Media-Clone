import type { Prisma } from "../../../generated/prisma";

export const publicUserIdentitySelect = {
  id: true,
  name: true,
  username: true,
} satisfies Prisma.UserSelect;

export const publicProfileSelect = {
  ...publicUserIdentitySelect,
  bio: true,
  isPublic: true,
  interest: true,
} satisfies Prisma.UserSelect;
