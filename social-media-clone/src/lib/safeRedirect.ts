export function getSafeRedirectPath(redirect: string | null) {
  if (
    !redirect ||
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    redirect.includes("\\") ||
    redirect === "/auth" ||
    redirect === "/login"
  ) {
    return "/";
  }

  return redirect;
}
