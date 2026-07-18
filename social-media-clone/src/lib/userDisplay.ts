export function getDisplayUsername(user: {
  name: string;
  username: string | null;
}) {
  const username = user.username?.replace(/^@/, "");
  return `@${username ?? user.name.toLowerCase().replace(/\s/g, "")}`;
}
