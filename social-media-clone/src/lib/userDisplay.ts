export function getDisplayUsername(user: { name: string; username: string | null }) {
    return user.username ?? `@${user.name.toLowerCase().replace(/\s/g, "")}`;
}
