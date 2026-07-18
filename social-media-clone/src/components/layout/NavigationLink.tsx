import Link from "next/link";
import type { JSX } from "react";

export default function NavigationLink({
  path,
  icon,
  displayText,
  isMobile,
  isSidebar = false,
}: {
  path: string;
  icon: JSX.Element;
  displayText: string;
  isMobile: boolean;
  isSidebar?: boolean;
}) {
  const desktopNavigationLinkStyle = `
        flex items-center gap-1.5 rounded-full px-3 py-1.5
        text-[14px] font-medium text-zinc-400
        transition-all duration-200
        hover:bg-white/5 hover:text-white
    `;

  const sidebarNavigationLinkStyle = `
        flex w-full items-center gap-3 rounded-2xl px-4 py-3
        text-[15px] font-medium text-zinc-300
        transition-colors duration-200
        hover:bg-white/5 hover:text-white
    `;

  const mobileNavigationLinkStyle = `
        flex items-center gap-3 rounded-xl px-3 py-2.5
        text-[15px] font-medium text-zinc-300
        transition-colors duration-200
        hover:bg-white/5 hover:text-white
    `;

  return (
    <Link
      href={path}
      className={
        isMobile
          ? mobileNavigationLinkStyle
          : isSidebar
            ? sidebarNavigationLinkStyle
            : desktopNavigationLinkStyle
      }
    >
      {icon}
      {displayText}
    </Link>
  );
}
